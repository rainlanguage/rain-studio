import { supabaseClient } from '$lib/supabaseClient';
import { error as errorKit } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const search_value = '';
	const selected_networks = [-1];

	// Using this function to retrieve 52 (limit) contracts starting with the 0 offset
	const { data: deployersData, error: deployersError } = await supabaseClient.rpc(
		'get_deployers_with_addresses_by_filters_pagination',
		{
			search_value,
			selected_networks,
			offset_: 0
		}
	);

	const { data: counterData, error: counterError } = await supabaseClient.rpc(
		'get_deployers_with_addresses_by_filters_count',
		{
			search_value,
			selected_networks
		}
	);

	if (deployersError || counterError) {
		console.log(deployersError ?? counterError);
		throw errorKit(404, 'Not found');
	}

	return { interpreters: deployersData, counterInterpreters: counterData };
}
