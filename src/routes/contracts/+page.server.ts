import { supabaseClient } from '$lib/supabaseClient';
import { error as errorKit } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const { data, error } = await supabaseClient.rpc('get_contracts_with_addresses_by_filters', {
		//  Empty search value will not filter nothing by this value
		search_value: '',
		// The `-1` indicate to not filter by networks
		selected_networks: [-1]
	});

	if (error) throw errorKit(404, 'Not found');

	return { contract: data };
}

// import { supabaseClient } from '$lib/supabaseClient';
// import { error } from '@sveltejs/kit';

// /** @type {import('./$types').PageServerLoad} */
// export async function load() {
// 	const query = await supabaseClient.from('contracts_new').select('*, contract_addresses_new(id, address, chain_id)');

// 	if (query.error) throw error(404, 'Not found');

// 	return { contract: query.data };
// }
