import type { InterpreterRowFull } from '$lib/types/types';
import type { Abi, AbiError, AbiEvent, AbiFunction } from 'abitype';
import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
import { allChainsData } from 'svelte-ethers-store';

// getting all of the state changing methods for this abi
export const getWriteMethods = (
	abi: Abi
): { label: string; value: { name: string; def: AbiFunction }; index: number }[] => {
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

// getting the chains for which there's both a known address for contract and interpreter
export const getCommonChains = (interpreterInstances: any[], metadata: any): number[] => {
	// will only include unique chains
	const chains: Set<number> = new Set();
	interpreterInstances.forEach((interpreter) => {
		chains.add(interpreter.chainId);
	});
	metadata.addresses.forEach((address) => {
		chains.add(address.chainId);
	});
	return Array.from(chains.values());
};

export const getInterpretersForChain = (
	interpreters: InterpreterRowFull[],
	chainId: number
): { label: string; value: { interpreter: string; deployer: string } }[] => {
	const interpretersForSelect: {
		label: string;
		value: {
			id: string;
			interpreterAddress: string;
			deployerAddress: string;
			interpreter: InterpreterRowFull;
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
