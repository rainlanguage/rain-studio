import { supabaseClient } from '$lib/supabaseClient';
import { error as errorKit } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const search_value = '';
	const selected_networks = [-1];

	// Using this function to retrieve 52 (limit) contract starting with the 0 offset
	const { data: contractsData, error: contractsError } = await supabaseClient.rpc(
		'get_contracts_with_addresses_by_filters_pagination',
		{
			search_value,
			selected_networks,
			offset_: 0
		}
	);

	const { data: counterData, error: counterError } = await supabaseClient.rpc(
		'get_contracts_with_addresses_by_filters_count',
		{
			search_value,
			selected_networks
		}
	);

	if (contractsError || counterError) {
		console.log(contractsError ?? counterError);
		throw errorKit(404, 'Not found');
	}

	return { contract: contractsData, counterContracts: counterData };
}
