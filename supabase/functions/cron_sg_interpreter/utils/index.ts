/* eslint-disable @typescript-eslint/no-explicit-any */

import { arrayify, isBytesLike, inflate, uuidv5 } from '../deps.ts';
import { decodedMeta, decodedMetaOPMETA } from './rainDocuments.ts';

import type { Client } from 'https://esm.sh/v111/@urql/core@3.2.0';
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0-rc.12';
import type {
	ContractSG,
	ContractDB,
	Metadata,
	ContractMeta,
	DataContractUpload,
	DataAddressUpload,
	DeployerDB,
	RainterpreterDB,
	Rainterpreter_storesDB,
	ExpressionDeployerSG,
	InterpreterSG,
	RainterpreterStoreSG,
	DataDeployerUpload,
	DataDeployerAddressUpload,
	DataRainterpreterUpload,
	DataRainterpreterAddressUpload,
	DataRainterpreterStoreUpload,
	DataRainterpreterStoreAddressUpload
} from '../types.ts';

export * from './rainDocuments.ts';
export const textDecoder = new TextDecoder();
export const UUIDnamespace = '0d91cfc8-9be0-4458-8f05-5bd5a5bc2fbb';

export async function getContracts(supabaseClient_: SupabaseClient, subgraphClient_: Client) {
	// Querying the contracts from supabase
	const dBContracts = await _getDBContracts(supabaseClient_);

	// Querying the contracts from the subgraph endpoint passed
	const sgContracts = await _getSGContracts(subgraphClient_);

	return {
		dBContracts,
		sgContracts
	};
}

export async function _getDBInterpretersData(supabaseClient_: SupabaseClient) {
	// Getting the `deployers` from supabase
	const respDeployer = await supabaseClient_.from('deployers').select('*, deployers_addresses(*)');
	if (respDeployer.error)
		throw new Error(`Cannot query the deployers from DB:  ${respDeployer.error}`);

	// Getting the `rainterpreters` from supabase
	const respRainterpreters = await supabaseClient_
		.from('rainterpreters')
		.select('*, rainterpreter_addresses(*)');
	if (respRainterpreters.error)
		throw new Error(`Cannot query the rainterpreters from DB:  ${respRainterpreters.error}`);

	// Getting the `rainterpreter_stores` from supabase
	const respStores = await supabaseClient_
		.from('rainterpreter_stores')
		.select('*, rainterpreter_store_addresses(*)');
	if (respStores.error)
		throw new Error(`Cannot query the rainterpreter_stores from DB:  ${respStores.error}`);

	const deployersDB = respDeployer.data as Array<DeployerDB>;
	const rainterpretersDB = respRainterpreters.data as Array<RainterpreterDB>;
	const rainterpreter_storesDB = respStores.data as Array<Rainterpreter_storesDB>;

	return {
		deployersDB,
		rainterpretersDB,
		rainterpreter_storesDB
	};
}

export async function _getSGInterpreters(subgraphClient_: Client) {
	const query = `
		{
			expressionDeployers {
				id
				bytecodeHash
				meta
			}
			interpreters {
				id
				instances {
					id
				}
			}
			rainterpreterStores {
				id
				instances {
					id
				}
			}
		}
	`;

	const resp = await subgraphClient_.query(query, {}).toPromise();

	if (resp.error) throw new Error(`Cannot query from SG:  ${resp.error.message}`);

	const deployersSG = resp.data.expressionDeployers as Array<ExpressionDeployerSG>;
	const rainterpretersSG = resp.data.interpreters as Array<InterpreterSG>;
	const rainterpreter_storesSG = resp.data.rainterpreterStores as Array<RainterpreterStoreSG>;

	return {
		deployersSG,
		rainterpretersSG,
		rainterpreter_storesSG
	};
}

/**
 * @public
 * `WIP:` Inverse of `deflateJson`. Get a hex string  or Uint8Array and inflate
 * the JSON to obtain an string with the decoded data.
 *
 * @param bytes - Bytes to infalte to json
 */
export const inflateJson = (bytes: unknown) => {
	if (!isBytesLike(bytes)) throw new Error('invalid bytes');
	const _uint8Arr = arrayify(bytes, { allowMissingPrefix: true });

	try {
		const inflated = inflate(_uint8Arr);
		console.log('inflated');
		const decoded = textDecoder.decode(inflated);
		console.log('decoded');
		const parsed = JSON.parse(decoded);
		console.log('parsed');
		console.log(parsed);
		return parsed;
	} catch (error) {
		console.log(error);
	}
};

/**
 * TODO: At the moment only Mumbai
 * @returns
 */
export function getSubgraph(): Array<{
	subgraph_url: string;
	chainId: number;
}> {
	return [
		{
			subgraph_url: 'https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry',
			chainId: 80001
		}
	];
}

export function buildMetadataFromMeta(contractMeta_: ContractMeta): Metadata {
	return {
		name: contractMeta_.name,
		source: contractMeta_.source,
		description: contractMeta_.desc,
		version: {
			major: 0,
			minor: 1
		},
		inputs: contractMeta_.methods[0].inputs,
		expressions: contractMeta_.methods[0].expressions
	};
}

export function filterNonAddedContracts(
	sgContracts_: Array<ContractSG>,
	dbContracts_: ContractDB[],
	chainId: number
) {
	const contractsToAdd: {
		[key: string]: DataContractUpload;
	} = {};

	const addressesToAdd: {
		[key: string]: DataAddressUpload;
	} = {};

	/**
	 * Add a new address to `addressesToAdd` using this local scope
	 */
	function addAddress(address_: string, contractId_: string, type_?: string) {
		const addressID = uuidv5(address_ + chainId.toString(), UUIDnamespace);
		addressesToAdd[addressID] = {
			id: addressID,
			address: address_,
			chainId: chainId,
			contract: contractId_,
			type: type_ ?? 'contract'
		};
	}

	for (let i = 0; i < sgContracts_.length; i++) {
		const SGcontract = sgContracts_[i];
		const contractID = uuidv5(SGcontract.bytecodeHash, UUIDnamespace);

		const contractMatched = dbContracts_.find((contract_) => contract_.id === contractID);

		if (!contractMatched) {
			// Check if it is already cached
			if (contractsToAdd[contractID]) {
				// Add to contract_address table with the reference to `contractID` because a matched was not found before
				addAddress(SGcontract.id, contractID);
			} else {
				// Decoded the meta
				const metaDecoded = decodedMeta(SGcontract.meta);

				// Use the values decoded to prepare to insert
				if (metaDecoded) {
					// To insert the new Contracts
					contractsToAdd[contractID] = {
						id: contractID,
						bytecode_hash: SGcontract.bytecodeHash,
						abi: metaDecoded.abi,
						contract_meta: metaDecoded.contractMeta,
						metadata: buildMetadataFromMeta(metaDecoded.contractMeta),
						slug: metaDecoded?.contractMeta.alias
					};

					// To insert the new address with the Contract referece
					addAddress(SGcontract.id, contractID);
				}
			}
		} else {
			const addressID = uuidv5(SGcontract.id + chainId.toString(), UUIDnamespace);

			const addressContract = contractMatched.contract_addresses_new.find(
				(item_) => item_.id === addressID
			);

			// If does not exist in the DB, prepare data to insert
			if (!addressContract) {
				addAddress(SGcontract.id, contractID);
			}
		}
	}

	return { contractsToAdd, addressesToAdd };
}

export function filterNonAddedDeployers(
	sgDeployers_: ExpressionDeployerSG[],
	dbDeployers_: DeployerDB[],
	chainId: number
) {
	const deployersToAdd: {
		[key: string]: DataDeployerUpload;
	} = {};

	const deployersAddressesToAdd: {
		[key: string]: DataDeployerAddressUpload;
	} = {};

	/**
	 * Add a new address to `deployersAddressesToAdd` using this local scope
	 */
	function addAddress(address_: string, deployerId_: string) {
		const addressID = uuidv5(address_ + chainId.toString(), UUIDnamespace);
		deployersAddressesToAdd[addressID] = {
			id: addressID,
			deployer: deployerId_,
			address: address_,
			chainId: chainId
		};
	}

	for (let i = 0; i < sgDeployers_.length; i++) {
		const SGdeployer = sgDeployers_[i];
		const deployerID = uuidv5(SGdeployer.bytecodeHash, UUIDnamespace);

		const deployerMatched = dbDeployers_.find((deployer_) => deployer_.id === deployerID);

		if (!deployerMatched) {
			// Check if it is already cached
			if (deployersToAdd[deployerID]) {
				// Add to contract_address table with the reference to `contractID` because a matched was not found before
				addAddress(SGdeployer.id, deployerID);
			} else {
				// Decoded the meta
				const opmetaDecoded = decodedMetaOPMETA(SGdeployer.meta);

				// Use the values decoded to prepare to insert
				if (opmetaDecoded) {
					// To insert the new Contracts
					deployersToAdd[deployerID] = {
						id: deployerID,
						bytecode_hash: SGdeployer.bytecodeHash,
						opmeta: opmetaDecoded
					};

					// To insert the new address with the Contract referece
					addAddress(SGdeployer.id, deployerID);
				}
			}
		} else {
			const addressID = uuidv5(SGdeployer.id + chainId.toString(), UUIDnamespace);

			const addressDeployer = deployerMatched.deployers_addresses.find(
				(item_) => item_.id === addressID
			);

			// If does not exist in the DB, prepare data to insert
			if (!addressDeployer) {
				addAddress(SGdeployer.id, deployerID);
			}
		}
	}

	return { deployersToAdd, deployersAddressesToAdd };
}

export function filterNonAddedRainterpreters(
	sgRainterpreters_: InterpreterSG[],
	dbRainterpreters_: RainterpreterDB[],
	chainId: number
) {
	const rainterpretersToAdd: {
		[key: string]: DataRainterpreterUpload;
	} = {};

	const rainterpreterAddressesToAdd: {
		[key: string]: DataRainterpreterAddressUpload;
	} = {};

	/**
	 * Add a new address to `rainterpreterAddressesToAdd` using this local scope
	 */
	function addAddress(address_: string, rainterpreterId_: string) {
		const addressID = uuidv5(address_ + chainId.toString(), UUIDnamespace);
		rainterpreterAddressesToAdd[addressID] = {
			id: addressID,
			rainterpreter: rainterpreterId_,
			address: address_,
			chainId: chainId
		};
	}

	for (let i = 0; i < sgRainterpreters_.length; i++) {
		const SGrainterpreter = sgRainterpreters_[i];
		const rainterpreterID = uuidv5(SGrainterpreter.id, UUIDnamespace);

		const rainterpreterMatched = dbRainterpreters_.find(
			(rainterpreter_) => rainterpreter_.id === rainterpreterID
		);

		if (!rainterpreterMatched) {
			// Check if it is already cached
			if (rainterpretersToAdd[rainterpreterID]) {
				// Add to contract_address table with the reference to `contractID` because a matched was not found before
				addAddress(SGrainterpreter.id, rainterpreterID);
			} else {
				// To insert the new Contracts
				rainterpretersToAdd[rainterpreterID] = {
					id: rainterpreterID,
					bytecode_hash: SGrainterpreter.id
				};

				// To insert the new address with the Contract referece
				addAddress(SGrainterpreter.id, rainterpreterID);
			}
		} else {
			const addressID = uuidv5(SGrainterpreter.id + chainId.toString(), UUIDnamespace);

			const addressRainterpreter = rainterpreterMatched.rainterpreter_addresses.find(
				(item_) => item_.id === addressID
			);

			// If does not exist in the DB, prepare data to insert
			if (!addressRainterpreter) {
				addAddress(SGrainterpreter.id, rainterpreterID);
			}
		}
	}

	return { rainterpretersToAdd, rainterpreterAddressesToAdd };
}

export function filterNonAddedStores(
	sgStores_: RainterpreterStoreSG[],
	dbStores_: Rainterpreter_storesDB[],
	chainId: number
) {
	const storesToAdd: {
		[key: string]: DataRainterpreterStoreUpload;
	} = {};

	const storeAddressesToAdd: {
		[key: string]: DataRainterpreterStoreAddressUpload;
	} = {};

	/**
	 * Add a new address to `storeAddressesToAdd` using this local scope
	 */
	function addAddress(address_: string, storeId_: string) {
		const addressID = uuidv5(address_ + chainId.toString(), UUIDnamespace);
		storeAddressesToAdd[addressID] = {
			id: addressID,
			rainterpreter_store: storeId_,
			address: address_,
			chainId: chainId
		};
	}

	for (let i = 0; i < sgStores_.length; i++) {
		const SGstore = sgStores_[i];
		const storeID = uuidv5(SGstore.id, UUIDnamespace);

		const storeMatched = dbStores_.find((store_) => store_.id === storeID);

		if (!storeMatched) {
			// Check if it is already cached
			if (storesToAdd[storeID]) {
				// Add to contract_address table with the reference to `contractID` because a matched was not found before
				addAddress(SGstore.id, storeID);
			} else {
				// To insert the new Contracts
				storesToAdd[storeID] = {
					id: storeID,
					bytecode_hash: SGstore.id
				};

				// To insert the new address with the Contract referece
				addAddress(SGstore.id, storeID);
			}
		} else {
			const addressID = uuidv5(SGstore.id + chainId.toString(), UUIDnamespace);

			const addressStore = storeMatched.rainterpreter_store_addresses.find(
				(item_) => item_.id === addressID
			);

			// If does not exist in the DB, prepare data to insert
			if (!addressStore) {
				addAddress(SGstore.id, storeID);
			}
		}
	}

	return { storesToAdd, storeAddressesToAdd };
}

async function _getDBContracts(supabaseClient_: SupabaseClient): Promise<ContractDB[]> {
	const resp = await supabaseClient_.from('contracts_new').select('*, contract_addresses_new(*)');
	if (resp.error) throw new Error(`Cannot query from DB:  ${resp.error}`);

	return resp.data;
}

async function _getSGContracts(subgraphClient_: Client): Promise<ContractSG[]> {
	const query = `
		{
			contracts {
				id
				bytecodeHash
				meta
			}
		}
	`;
	const resp = await subgraphClient_.query(query, {}).toPromise();

	if (resp.error) throw new Error(`Cannot query from SG:  ${resp.error.message}`);

	return resp.data.contracts as Array<ContractSG>;
}
