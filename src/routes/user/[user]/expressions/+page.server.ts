import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { getDeployedExpressionsForUser } from '$lib/expressions/expressions';

// /** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
	const { fetch, params } = event;
	const { supabaseClient, session } = await getSupabase(event);
	const userQuery = await supabaseClient
		.from('wallet_users')
		.select('*')
		.eq('username', params.user)
		.single();
	if (!userQuery?.data) throw error(404, 'Not found');

	// getting all contracts
	const contractsQuery = await supabaseClient
		.from('contracts')
		.select('*')

	// getting all interpreters
	const interpretersQuery = await supabaseClient
		.from('interpreters')
		.select('*')


	// using an endpoint here to get the current users expressions
	// note that this endpoint takes the user id, not the username,
	// as the user id is generally more readily available in the app
	// as part of the session
	const resp = await fetch(`/user/${session?.user.id}/expressions`, {
		method: 'POST',
		body: JSON.stringify(
			{ order: ['created_at', { ascending: false }] }
		)
	});

	const tagResp = await supabaseClient.rpc('get_unique_tags_for_user_w')
	if (tagResp.error) throw error(404, 'Not found');
	const tags = tagResp.data[0]?.tags?.slice(1, -1)?.split(',')

	let draft_expressions;
	if (resp.ok) ({ draft_expressions } = await resp.json());
	const deployedExpressions = await getDeployedExpressionsForUser(userQuery.data, supabaseClient);

	return {
		deployedExpressions,
		user: userQuery.data,
		draft_expressions,
		currentUser: session?.user.id == userQuery.data.id,
		contracts: contractsQuery.data,
		interpreters: interpretersQuery.data,
		tags
	};
};
