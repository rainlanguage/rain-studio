import { supabaseClient } from '$lib/supabaseClient';
import { error as errorKit } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// Using this function to retrieve 50 (limit) contract starting with the 0 offset
	const { data, error } = await supabaseClient.rpc('get_contracts_address_no_filters', {
		offset_: 0
	});

	if (error) throw errorKit(404, 'Not found');

	return { contract: data };
}
