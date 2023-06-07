import type { Database } from '$lib/types/generated-db-types';
import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';
import { getNetworksByChainIds } from '$lib/utils';
import { allChainsData, type ChainData } from 'svelte-ethers-store';

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
/**
 *
 * Get all the chains from a DB response or similar structure of 'addresses' row
 */
export const getChainsFromInterpreterAddresses = (
	interpreter_addresses: {
		[key: string]: any;
		addresses: Database['public']['Tables']['deployers_addresses']['Row'];
	}[]
): ChainData[] => {
	if (!interpreter_addresses.length) return [];

	const uniqueChainIds = Array.from(
		new Set(interpreter_addresses.map((address_) => address_.chain_id))
	).sort();

	return getNetworksByChainIds(uniqueChainIds);
};

// filtering to the known addresses for the selected chain
export const getKnownContractAddressesForChain = (
	contractAddresses: ContractAddressRow[],
	chain_id: number
) => {
	return contractAddresses
		.filter((contractAddress) => contractAddress.chain_id == chain_id)
		?.map((contractAddress) => {
			return { label: contractAddress.address, value: contractAddress.address };
		});
};

export const getNameFromChainId = (id: number): string => {
	const name = allChainsData.find((chain) => chain.chainId == id)?.name;
	if (!name) throw Error('Unknown chain_id');
	return name;
};

// getting the chains for which there's both a known address for contract and interpreter
export const getCommonChains = (
	deployers: DeployerAddressesRow[],
	contractAddresses: ContractAddressRow[]
): number[] => {
	// will only include unique chains
	const chains: Set<number> = new Set();
	deployers.forEach((deployer) => {
		chains.add(deployer.chain_id);
	});
	contractAddresses.forEach((el) => {
		chains.add(el.chain_id);
	});
	return Array.from(chains.values());
};
