import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { getDeployedExpressionsForUser } from '$lib/expressions/expressions';

// /** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
	const { fetch, params } = event;
	const { supabaseClient, session } = await getSupabase(event);
	const userQuery = await supabaseClient
		.from('profiles')
		.select('*')
		.eq('username', params.user)
		.single();
	if (!userQuery?.data) throw error(404, 'Not found');

	// using an endpoint here to get the current users expressions
	// note that this endpoint takes the user id, not the username,
	// as the user id is generally more readily available in the app
	// as part of the session
	const resp = await fetch(`/user/${session?.user.id}/expressions`, { method: 'POST' });
	let draft_expressions;
	if (resp.ok) ({ draft_expressions } = await resp.json());
	const deployedExpressions = await getDeployedExpressionsForUser(userQuery.data, supabaseClient);

	return {
		deployedExpressions,
		draft_expressions,
		currentUser: session?.user.id == userQuery.data.id
	};
};
