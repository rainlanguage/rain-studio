import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { supabaseClient as _supabaseClient } from '$lib/supabaseClient';

/**
 * Method to search the db for an array of possible interpreter addresses.
 *
 * @param addresses - addresses to search for
 * @param supabaseClient - (optional) The supabaseClient. If using in a load fn, pass in the client from the load event. Otherwise if this is happening client side, the function will create a client for you.
 */
export const matchInterpreters = async (
    addresses: string[],
    supabaseClient?: TypedSupabaseClient
) => {
    const interpreters_array = addresses;
    if (!supabaseClient) supabaseClient = _supabaseClient;
    const interpretersQuery = await supabaseClient.rpc('match_interpreters_by_address', {
        interpreters_array
    });
    if (interpretersQuery.error) throw Error(interpretersQuery.error.message);
    return interpretersQuery.data;
};

/**
 * Method to search the db for an array of possible contract addresses.
 *
 * @param addresses - (optional) addresses to search for
 * @param supabaseClient - (optional) The supabaseClient. If using in a load fn, pass in the client from the load event. Otherwise if this is happening client side, the function will create a client for you.
 */
export const matchContracts = async (addresses: string[], supabaseClient?: TypedSupabaseClient) => {
    const contracts_array = addresses;

    if (!supabaseClient) supabaseClient = _supabaseClient;

    const contractsQuery = await supabaseClient.rpc('match_contracts_by_address', {
        contracts_array
    });

    if (contractsQuery.error) throw Error(contractsQuery.error.message);

    // mapping the data back into structure that comes from the js client queries
    return contractsQuery.data.map((contract: any) => ({
        id: contract.id,
        metadata: contract.metadata,
        contract_address: contract.contract_address,
        project: {
            id: contract.project_id,
            logo_url: contract.logo_url,
            name: contract.name
        }
    }));
};
