import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error as kitError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { order, selectedContract, selectedInterpreter } = await event.request.json()
	console.log('order', order)
	const { supabaseClient } = await getSupabase(event);
	let query = supabaseClient
		.from('draft_expressions')
		.select('*, contract ( metadata, project (name, logo_url), id ), interpreter ( metadata, id )')

	if (selectedContract) query = query.eq('contract', selectedContract)
	if (selectedInterpreter) query = query.eq('interpreter', selectedInterpreter)

	const { data, error } = await query.order(...order);

	if (error) throw kitError(404, 'Not found');

	const draft_expressions = data;

	return new Response(JSON.stringify({ draft_expressions }));
};
