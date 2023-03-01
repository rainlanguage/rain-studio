import type { InterpreterRowFull } from '$lib/types/types';
import type { Abi, AbiError, AbiEvent, AbiFunction } from 'abitype';
import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
import { allChainsData } from 'svelte-ethers-store';

// getting all of the state changing methods for this abi
export const getWriteMethods = (abi: Abi) => {
	return abi
		.filter(
			(method: AbiFunction | AbiEvent | AbiError): method is AbiFunction =>
				method.type == 'function' &&
				'inputs' in method &&
				'name' in method &&
				method.name !== 'createChild' &&
				method.stateMutability !== 'view'
		)
		.map((method: AbiFunction, index: number) => ({
			label: method.name,
			value: { name: method.name, def: method },
			index
		}));
};

export const getNameFromChainId = (id: number): string => {
	const name = allChainsData.find((chain) => chain.chainId == id)?.name;
	if (!name) throw Error('Unknown chainId');
	return name;
};

// Returns chains which are shared by both contract address and interpreter address
export const getCommonChains = (interpreters, metadata: ContractMetadata): number[] => {
	// Only include unique chains
	const interpreterChains: Set<number> = new Set();
	const contractChains: Set<number> = new Set();

	interpreters.forEach((interpreterAddress) => {
		if (interpreterAddress.chainId) interpreterChains.add(interpreterAddress.chainId);
	});

	metadata.addresses.forEach((contractAddress) => {
		if (contractAddress.chainId) contractChains.add(contractAddress.chainId);
	});

	// Inner join. If chain is not shared, delete from set.
	interpreterChains.forEach((interpreterChain) => {
		if (!contractChains.has(interpreterChain)) {
			interpreterChains.delete(interpreterChain);
		}
	});

	return Array.from(interpreterChains.values());
};

export const getInterpretersForChain = (interpreters, chainId: number) => {
	const interpretersForSelect: {
		label: string;
		value: {
			id: string;
			interpreterAddress: string;
			deployerAddress: string;
			interpreter;
		};
	}[] = [];
	interpreters.forEach((interpreter) => {
		interpreter.metadata.addresses.forEach((address) => {
			if (address.chainId == chainId) {
				address.knownAddresses.forEach((address) =>
					interpretersForSelect.push({
						label: `${interpreter.metadata.name}: ${address.interpreter}`,
						value: {
							id: interpreter.id,
							interpreter,
							interpreterAddress: address.interpreter,
							deployerAddress: address.deployer
						}
					})
				);
			}
		});
	});
	return interpretersForSelect;
};

// filtering to the known addresses for the selected chain
export const getKnownContractAddressesForChain = (metadata: ContractMetadata, chainId: number) => {
	return metadata.addresses
		.filter((chain) => chain.chainId == chainId)[0]
		?.knownAddresses.map((address) => {
			return { label: address, value: address };
		});
};
