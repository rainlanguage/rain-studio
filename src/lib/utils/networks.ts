import type { Database } from '$lib/types/generated-db-types';
import { allChainsData, type ChainData } from 'svelte-ethers-store';

export const networkOptions = [
	{ label: 'Ethereum', value: 1 },
	{ label: 'Polygon', value: 137 },
	{ label: 'Mumbai', value: 80001 }
];

export const getNetworkByChainId = (chainId_: number | string): ChainData | undefined => {
	return allChainsData.find((chain_) => chain_.chainId == chainId_);
};

export const getNetworksByChainIds = (chainId_: Array<number | string>): ChainData[] => {
	return allChainsData.filter((chain_) => chainId_.includes(chain_.chainId));
};

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
