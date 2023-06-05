import { supabaseClient } from '$lib/supabaseClient';
import { error as errorKit } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const search_value = '';
	const selected_networks = [-1];
	const selected_interpreters = ['All'];

	// Using this function to retrieve 52 (limit) contract starting with the 0 offset
	const { data: interpretersData, error: errorInterpreters } = await supabaseClient.rpc(
		'get_combined_interpreters_by_filters_pagination',
		{
			search_value,
			selected_networks,
			selected_interpreters,
			offset_: 0
		}
	);

	const { data: counterData, error: counterError } = await supabaseClient.rpc(
		'get_combined_interpreters_by_filters_count',
		{
			search_value,
			selected_networks,
			selected_interpreters
		}
	);

	if (errorInterpreters || counterError) {
		console.log(errorInterpreters ?? counterError);
		throw errorKit(404, 'Not found');
	}

	return { interpreters: interpretersData, counterInterpreters: counterData };
}
