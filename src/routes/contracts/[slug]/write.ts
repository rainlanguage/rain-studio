import type { DeployerAddressesRow } from '$lib/types/types';
import type { Abi, AbiError, AbiEvent, AbiFunction } from 'abitype';

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

export const getInterpretersForChain = (
	deployers: DeployerAddressesRow[],
	chain_id: number
): {
	label: string;
	value: {
		id: string;
		deployerAddress: string;
		deployer: DeployerAddressesRow;
	};
}[] => {
	const deployersForSelect: {
		label: string;
		value: {
			id: string;
			deployerAddress: string;
			deployer: DeployerAddressesRow;
		};
	}[] = [];
	deployers.forEach((deployer) => {
		if (deployer.chain_id == chain_id) {
			deployersForSelect.push({
				label: `${deployer.address}`,
				value: {
					id: deployer.id,
					deployer,
					deployerAddress: deployer.address
				}
			});
		}
	});
	return deployersForSelect;
};
