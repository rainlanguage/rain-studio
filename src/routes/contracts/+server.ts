import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error as kitError, json as jsonResponse } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { searchValue, selectedNetworks, offset_ } = (await event.request.json()) as {
		searchValue: string;
		selectedNetworks: Array<number>;
		offset_: number;
	};
	const { supabaseClient } = await getSupabase(event);

	const { data, error } = await supabaseClient.rpc('get_contracts_with_addresses_by_filters', {
		search_value: searchValue,
		selected_networks: selectedNetworks,
		offset_
	});

	if (error) throw kitError(404, 'Not found');

	return jsonResponse({ contractsFiltered: data });
};
