import type { Database } from '$lib/types/generated-db-types';
import { getNetworksByChainIds } from '$lib/utils';
import type { ChainData } from 'svelte-ethers-store';

/**
 * Get all the chains from a DB response or similar structure of 'contract_addresses_new' row
 */
export const getChainsFromAddresses = (
	contract_addresses_: Database['public']['Tables']['contract_addresses_new']['Row'][]
): ChainData[] => {
	if (!contract_addresses_.length) return [];

	const uniqueChainIds = Array.from(
		new Set(contract_addresses_.map((address_) => address_.chain_id))
	).sort();

	return getNetworksByChainIds(uniqueChainIds);
};
