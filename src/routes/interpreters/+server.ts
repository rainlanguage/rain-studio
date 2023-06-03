import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error as kitError, json as jsonResponse } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	console.log('alo');
	const { searchValue, selectedNetworks, offset_ } = (await event.request.json()) as {
		searchValue: string;
		selectedNetworks: Array<number>;
		offset_: number;
	};
	const { supabaseClient } = await getSupabase(event);

	// Using this function to retrieve 52 (limit) contract starting with the 0 offset

	const { data: deployersData, error: deployersError } = await supabaseClient.rpc(
		'get_deployers_with_addresses_by_filters_pagination',
		{
			search_value: searchValue,
			selected_networks: selectedNetworks,
			offset_
		}
	);

	const { data: counterData, error: counterError } = await supabaseClient.rpc(
		'get_deployers_with_addresses_by_filters_count',
		{
			search_value: searchValue,
			selected_networks: selectedNetworks
		}
	);
	if (counterError) console.log(counterError);

	if (deployersError || counterError) {
		console.log(deployersError ?? counterError);
		throw kitError(404, 'Not found');
	}

	return jsonResponse({ interpreters: deployersData, counterInterpreters: counterData });
};
