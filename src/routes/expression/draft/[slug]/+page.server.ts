import type { ContractRowFull, ExpressionRow } from '$lib/types/types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const { supabaseClient, session } = await getSupabase(event);
	const slug = event.params.slug;
	let userQuery, contractQuery, interpreterQuery, userLike;

	const query = (await supabaseClient.rpc('get_expression_by_slug_w', {
		slug
	})) as PostgrestSingleResponse<ExpressionRow[]>;

	if (query?.data?.[0]) {
		userQuery = await supabaseClient
			.from('wallet_users')
			.select('*')
			.filter('id', 'eq', query.data[0].user_id)
			.single();

		if (query.data[0]?.contract)
			contractQuery = await supabaseClient
				.from('contracts')
				.select('*, project (*)')
				.filter('id', 'eq', query.data[0].contract)
				.single();

		interpreterQuery = await supabaseClient
			.from('interpreters')
			.select('*')
			.filter('id', 'eq', query.data[0].interpreter)
			.single();

		if (session) {
			const resp = await supabaseClient
				.from('starred')
				.select('*')
				.eq('foreign_key', query?.data?.[0].id)
				.eq('user_id', session.user.id)
				.single();

			userLike = resp.data ? true : false;
		}
	}

	// catch all the errors
	if (query?.error || userQuery?.error || contractQuery?.error || interpreterQuery?.error)
		throw error(404, 'Not found');
	// and make sure there's data for everything
	if (!query.data?.length || !userQuery?.data || !interpreterQuery?.data)
		throw error(404, 'Not found');
	return {
		expression: {
			...query.data[0],
			user_id: userQuery.data,
			contract: contractQuery?.data as unknown as ContractRowFull,
			interpreter: interpreterQuery.data,
		},
		userLike
	};
}
