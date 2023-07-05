import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error as errorKit, json as jsonResponse } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { searchValue, selectedNetworks, selectedInterpreter, offset_ } =
		(await event.request.json()) as {
			searchValue: string;
			selectedNetworks: Array<number>;
			selectedInterpreter: Array<string>;
			offset_: number;
		};
	const { supabaseClient } = await getSupabase(event);

	// Using this function to retrieve 52 (limit) contract starting with the 0 offset
	const { data: interpretersData, error: errorInterpreters } = await supabaseClient.rpc(
		'get_combined_interpreters_by_filters_pagination',
		{
			search_value: searchValue,
			selected_networks: selectedNetworks,
			selected_interpreters: selectedInterpreter,
			offset_
		}
	);

	const { data: counterData, error: counterError } = await supabaseClient.rpc(
		'get_combined_interpreters_by_filters_count',
		{
			search_value: searchValue,
			selected_networks: selectedNetworks,
			selected_interpreters: selectedInterpreter
		}
	);

	if (errorInterpreters || counterError) {
		console.log(errorInterpreters ?? counterError);
		throw errorKit(404, 'Not found');
	}

	return jsonResponse({ interpretersFiltered: interpretersData, counterFiltered: counterData });
};
