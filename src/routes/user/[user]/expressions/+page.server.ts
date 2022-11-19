import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const { supabaseClient, session } = await getSupabase(event);

	// console.log(event)

	const query = await supabaseClient
		.from('draft_expressions')
		.select('*, contract ( metadata, project (name, logo_url) ), interpreter ( metadata, id )');

	const draft_expressions = session?.user.id == event.params.user ? query.data : [];

	console.log(session);

	if (query.error) throw error(404, 'Not found');

	return { draft_expressions };
}
