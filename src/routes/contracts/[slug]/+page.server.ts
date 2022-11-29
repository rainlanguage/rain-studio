import { supabaseClient } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const contractQuery = await supabaseClient
		.from('contracts')
		.select('project ( * ), *')
		.eq('slug', params.slug).single();

	if (contractQuery.error) throw error(404, 'Not found');

	const interpretersQuery = await supabaseClient.from('interpreters').select('*')

	if (interpretersQuery.error) throw error(500, 'Something went wrong :(');


	return { contract: contractQuery.data, interpreters: interpretersQuery.data };
}
