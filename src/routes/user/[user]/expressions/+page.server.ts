import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { createClient } from '@urql/core';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Database } from '$lib/types/generated-db-types';
import { matchContracts, matchInterpreters } from '$lib/match-addresses';


// /** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
	const { fetch, params } = event;
	const { supabaseClient, session } = await getSupabase(event);
	const userQuery = await supabaseClient.from('profiles').select('*').eq('username', params.user).single()
	if (!userQuery?.data) throw error(404, 'Not found');

	// using an endpoint here to get the current users expressions
	// note that this endpoint takes the user id, not the username,
	// as the user id is generally more readily available in the app
	// as part of the session
	const resp = await fetch(`/user/${session?.user.id}/expressions`, { method: 'POST' });
	let draft_expressions;
	if (resp.ok) ({ draft_expressions } = await resp.json());
	const deployedExpressions = await getDeployedUserExpressions(supabaseClient, userQuery.data)

	return { deployedExpressions, draft_expressions, currentUser: session?.user.id == userQuery.data.id };
}

const getDeployedUserExpressions = async (supabaseClient: TypedSupabaseClient, user: Database['public']['Tables']['profiles']['Row']) => {
	const walletsQuery = await supabaseClient.from('wallets').select('*').eq('user_id', user.id)
	if (!walletsQuery.data) return null

	const wallets = walletsQuery.data.map(wallet => wallet.address?.toLowerCase())

	//	Only mumbai at the moment
	const client = createClient({
		url: subgraphs[0].url
	});

	const { data, error } = await client.query(query, { wallets }).toPromise();
	if (error) return null
	const sgUserExpressions = data.accounts[0].expressions

	// get all the interpreters in the db that match any of the interpreters used by the user's deployed expressions
	const matchedInterpreters = await matchInterpreters(sgUserExpressions.map(expression => expression.event.expression.interpreterInstance.id.toLowerCase()), supabaseClient)
	// console.log(matchedInterpreters)

	// get all the contracts in the db that match any of the senders for the expressions
	const matchedContracts = await matchContracts(sgUserExpressions.map(expression => expression.sender.id), supabaseClient)

	// create the final object to return
	const deployedExpressions = sgUserExpressions.map((expression: any) => ({
		stateConfig: expression?.event?.expression?.config,
		interpreter: matchedInterpreters.find((interpreter: any) => interpreter.interpreteraddress.toLowerCase() == expression.event.expression.interpreterInstance.id.toLowerCase()),
		contract: matchedContracts.find((contract: any) => contract.contract_address.toLowerCase() == expression.sender.id.toLowerCase())
	}))

	return deployedExpressions
}

const subgraphs = [
	{
		/**
		 * 	Only mumbai at the moment
		 */
		chain: 80001,
		url: 'https://api.thegraph.com/subgraphs/name/beehive-innovation/rain-expressions'
	}
];

const query = `query MyQuery($wallets: [ID!] = "") {
	accounts(where: {id_in: $wallets}) {
	  events {
		id
	  }
	  expressions {
		contextScratch
		sender {
			id
		}
		event {
		  expression {
			config {
			  constants
			  sources
			}
			interpreterInstance {
			  id
			}
		  }
		  timestamp
		}
	  }
	}
  }`