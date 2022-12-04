import { matchContracts, matchInterpreters } from "$lib/match-addresses";
import { supabaseClient as _supabaseClient } from "$lib/supabaseClient";
import type { Database } from "$lib/types/generated-db-types";
import type { ExpressionRow } from "$lib/types/types";
import { QueryAccountsFromArray, QueryExpression, Subgraphs } from "$lib/utils";
import type { TypedSupabaseClient } from "@supabase/auth-helpers-sveltekit/dist/types";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { createClient } from "@urql/core";
import { error as sveltekitError } from '@sveltejs/kit';
import { ethers } from "ethers";

export const createNewExpression = async (expression: Omit<Database['public']['Tables']['draft_expressions']['Insert'], 'raw_expression' | 'notes' | 'name'>) => {
    const _expression = { ...expression, notes: '', raw_expression: '', name: 'Untitled expression' }
    return await saveExpression(_expression)
}
export const saveExpression = async (expression: Database['public']['Tables']['draft_expressions']['Insert']): Promise<PostgrestSingleResponse<ExpressionRow>> => {
    const newExpression = await _supabaseClient
        .from('draft_expressions')
        .insert(expression)
        .select('*').single();
    return newExpression;
};

export const saveExpressionCopy = async (expression: Database['public']['Tables']['draft_expressions']['Insert']): Promise<ReturnType<typeof saveExpression>> => {
    const expressionCopy = { ...expression, name: `Copy of ${expression.name}` }
    return await saveExpression(expressionCopy)
}

/**
 * Gets all deployed expressions for a user.
 * This function gets all the user's linked wallets and fetches the deployed expressions from the subgraph.
 * It then matches the contract sender and interpreter from the db for each expression and returns the combined results.
 * 
 * @param user - user id to get deployed expressions for
 * @param supabaseClient - (optional) The supabaseClient. If using in a load fn, pass in the client from the load event. Otherwise if this is happening client side, the function will create a client for you.
 */
export const getDeployedExpressionsForUser = async (
    user: Database['public']['Tables']['profiles']['Row'],
    supabaseClient?: TypedSupabaseClient
) => {
    if (!supabaseClient) supabaseClient = _supabaseClient

    const walletsQuery = await supabaseClient.from('wallets').select('*').eq('user_id', user.id);

    if (!walletsQuery.data) return null;

    const wallets = walletsQuery.data.map((wallet) => wallet.address?.toLowerCase());

    //	Only mumbai at the moment
    const client = createClient({
        url: Subgraphs[0].url
    });

    const { data, error } = await client.query(QueryAccountsFromArray, { wallets }).toPromise();

    if (error || data.accounts.length == 0) return null;
    const sgUserExpressions = data.accounts[0].expressions;

    // get all the interpreters in the db that match any of the interpreters used by the user's deployed expressions
    const matchedInterpreters = await matchInterpreters(
        sgUserExpressions.map((expression: any) =>
            expression.event.expression.interpreterInstance.id.toLowerCase()
        ),
        supabaseClient
    );
    // console.log(matchedInterpreters)

    // get all the contracts in the db that match any of the senders for the expressions
    const matchedContracts = await matchContracts(
        sgUserExpressions.map((expression: any) => expression.sender.id),
        supabaseClient
    );

    // create the final object to return
    const deployedExpressions = sgUserExpressions.map((expression: any) => ({
        sg: { ...expression },
        stateConfig: expression?.event?.expression?.config,
        interpreter: matchedInterpreters.find(
            (interpreter: any) =>
                interpreter.interpreteraddress.toLowerCase() ==
                expression.event.expression.interpreterInstance.id.toLowerCase()
        ),
        contract: matchedContracts.find(
            (contract: any) =>
                contract.contract_address.toLowerCase() == expression.sender.id.toLowerCase()
        )
    }));

    return deployedExpressions;
};

/**
 * Queries the expression sg by address, then queries the db to match the contract and interpreter used.
 * Returns the combined results.
 * 
 * @param address - the address of the expression
 * @param supabaseClient - (optional) The supabaseClient. If using in a load fn, pass in the client from the load event. Otherwise if this is happening client side, the function will create a client for you.
 * 
 */
export const getDeployedExpressionByAddress = async (address: string, supabaseClient?: TypedSupabaseClient) => {
    if (!supabaseClient) supabaseClient = _supabaseClient

    //	query the sg
    const client = createClient({
        url: Subgraphs[0].url
    });

    const { data, error } = await client.query(QueryExpression, { address }).toPromise();
    if (error) throw sveltekitError(500, 'Not found');

    const userQuery = await supabaseClient.from('wallets').select('*, user_id (*)').eq('address', ethers.utils.getAddress(data.expression.account.id)).single()
    if (error) throw sveltekitError(500, 'Not found');

    const [contract] = await matchContracts([data.expression.sender.id], supabaseClient)
    const [interpreter] = await matchInterpreters([data.expression.interpreterInstance.id], supabaseClient)

    return { sg: data.expression, user: userQuery?.data?.user_id, expression: { contract, interpreter, stateConfig: data.expression.config } }
}