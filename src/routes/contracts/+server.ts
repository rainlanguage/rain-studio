import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error as kitError, json as jsonResponse } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ethers } from 'ethers';

export const POST: RequestHandler = async (event) => {
	const { searchValue, selectedNetworks } = (await event.request.json()) as {
		searchValue: string;
		selectedNetworks: Array<number>;
	};
	const { supabaseClient } = await getSupabase(event);

	let query = supabaseClient
		.from('contracts_new')
		.select('*, contract_addresses_new!inner(id, address, chainId)');

	if (selectedNetworks && selectedNetworks.length && !selectedNetworks.includes(-1)) {
		query = query.in('contract_addresses_new.chainId', selectedNetworks);
	}

	// Maybe this could support the bytecode hash (?) but for now only support search addresses
	if (ethers.utils.isHexString(searchValue)) {
		query = query.ilike('contract_addresses_new.address', `%${searchValue}%`);
	} else {
		query = query.ilike('metadata->>name', `%${searchValue}%`);
	}

	const { data, error } = await query;

	if (error) throw kitError(404, 'Not found');

	return jsonResponse({ contractsFiltered: data });
};
