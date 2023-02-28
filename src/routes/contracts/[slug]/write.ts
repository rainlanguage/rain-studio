import type { InterpreterRowFull } from '$lib/types/types';
import { Subgraphs } from '$lib/utils';
import type { Abi, AbiError, AbiEvent, AbiFunction } from 'abitype';
import { ethers } from 'ethers';
import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
import type { EVMAddress } from 'rain-metadata/metadata-types/general';
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

// TODO: Support multiple chains
export const getCommonChains = (interpreters: any[], contracts: any[]): number[] => [
	Subgraphs[0].chain
];

export const getInterpretersForChain = (interpreters: InterpreterRowFull[], chainId: number) => {
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
