import type { Database } from '$lib/types/generated-db-types';
import { allChainsData, type ChainData } from 'svelte-ethers-store';

import { mainnet, polygon, polygonMumbai } from '@wagmi/core/chains';
import type { Chain } from '@wagmi/core/chains';

/**
 * Default chains to be used by rain studio
 */
export const defaultChains = [mainnet, polygon, polygonMumbai];

export const networkOptions = defaultChains.map((chain_) => {
	return {
		label: chain_.name,
		value: chain_.id
	};
});

export const getNetworkByChainId_ = (chainId_: number | string): Chain | undefined => {
	return defaultChains.find((chain_) => chain_.id == chainId_);
};

export const getNetworksByChainIds_ = (chainId_: Array<number | string>): Chain[] => {
	return defaultChains.filter((chain_) => chainId_.includes(chain_.id));
};

/**
 * Get all the chains from a DB response or similar structure of 'contract_addresses_new' row
 */
export const getChainsFromAddresses_ = (
	contract_addresses_: Database['public']['Tables']['contract_addresses_new']['Row'][]
): Chain[] => {
	if (!contract_addresses_.length) return [];

	const uniqueChainIds = Array.from(
		new Set(contract_addresses_.map((address_) => address_.chain_id))
	).sort();

	return getNetworksByChainIds_(uniqueChainIds);
};

export const getBlockExplorerUrl = (
	chainId_: number | string,
	key_: string = 'default'
): string => {
	const networkInfo = getNetworkByChainId_(chainId_);
	if (networkInfo && networkInfo.blockExplorers) {
		const urlExplorer = networkInfo.blockExplorers[key_]?.url;

		if (urlExplorer) return urlExplorer;
	}
	return '';
};

export const getContractUrl = (address_: string, chainId_: number | string): string => {
	const urlExplorer = getBlockExplorerUrl(chainId_);
	if (urlExplorer) return `${urlExplorer}/address/${address_}`;

	return '';
};
////////////////////////////
////////////////////////////

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
