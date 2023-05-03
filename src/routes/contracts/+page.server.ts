import { supabaseClient } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const query = await supabaseClient.from('contracts_new').select('*, contract_addresses_new(id, address, chain_id)');

	if (query.error) throw error(404, 'Not found');

	return { contract: query.data };
}
