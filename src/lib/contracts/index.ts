import { getNetworksByChainIds } from '$lib/utils';
import { CloneFactoryAbi, prepareWriteFunction } from './contract-interactions';

import type { Chain } from '@wagmi/core/chains';
import type { Database } from '$lib/types/generated-db-types';
import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';

/** Key of the possible options, but just one should be selected at time. These
 * are mutually exclusive, but typescript will not throw an error, so this just
 * will show a compile error to alert the consumer
 */
type GetKnowContractOptions =
	| { onlyProxies: boolean; onlyContracts?: never }
	| { onlyProxies?: never; onlyContracts: boolean };

/**
 *
 * Get all the chains from a DB response or similar structure of 'addresses' row
 */
export const getChainsFromInterpreterAddresses = (
	interpreter_addresses: {
		[key: string]: any;
		addresses: Database['public']['Tables']['deployers_addresses']['Row'];
	}[]
): Chain[] => {
	if (!interpreter_addresses.length) return [];

	const uniqueChainIds = Array.from(
		new Set(interpreter_addresses.map((address_) => address_.chain_id))
	).sort();

	return getNetworksByChainIds(uniqueChainIds);
};

// filtering to the known addresses for the selected chain
export const getKnownContractAddressesForChain = (
	contractAddresses: { chain_id: number; address: string; type?: string }[],
	chain_id: number,
	options_?: GetKnowContractOptions
) => {
	return contractAddresses
		.filter((contractAddress) => {
			const correctChain = contractAddress.chain_id == chain_id;

			if (options_) {
				if (options_.onlyContracts) {
					return correctChain && contractAddress.type != 'proxy';
				}
				if (options_.onlyProxies) {
					return correctChain && contractAddress.type == 'proxy';
				}
			}

			return correctChain;
		})
		?.map((contractAddress) => {
			return { label: contractAddress.address, value: contractAddress.address };
		});
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

export const getCommonChainsInAddresses = (addresses: { chain_id: number }[]): number[] => {
	// will only include unique chains
	const chains: Set<number> = new Set();
	addresses.forEach((address_) => {
		chains.add(address_.chain_id);
	});

	return Array.from(chains.values());
};

export { CloneFactoryAbi, prepareWriteFunction };
