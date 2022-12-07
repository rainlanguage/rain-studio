import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error as kitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { order, selectedContract, selectedInterpreter, searchValue } = await event.request.json()
	const { supabaseClient } = await getSupabase(event);
	let query = supabaseClient
		.from('draft_expressions')
		.select('*, contract ( metadata, project (name, logo_url), id ), interpreter ( metadata, id )')

	if (selectedContract && selectedContract !== 'all' && selectedContract !== 'no-contract') query = query.eq('contract', selectedContract)
	if (selectedContract === 'no-contract') query = query.is('contract', null)
	if (selectedInterpreter) query = query.eq('interpreter', selectedInterpreter)
	if (searchValue) query = query.textSearch('name', searchValue, {
		type: "websearch",
		config: "english",
	})

	const { data, error } = await query.order(...order);
	if (error) throw kitError(404, 'Not found');

	const draft_expressions = data;

	return new Response(JSON.stringify({ draft_expressions }));
};
