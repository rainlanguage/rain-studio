/* eslint-disable @typescript-eslint/no-explicit-any */

import { arrayify, isBytesLike, inflate, uuidv5 } from '../deps.ts';
import { decodedMeta, decodedMetaOPMETA, MAGIC_NUMBERS } from './rainDocuments.ts';

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
	DataRainterpreterStoreAddressUpload,
	MetaDocumentSG,
	ABI,
	MetaContentV1SG
} from '../types.ts';

/**
 * Export all the functionalities around RainDocuments in Deno.
 */
export * from './rainDocuments.ts';

/**
 * The text Decoder in Deno.
 */
export const textDecoder = new TextDecoder();

/**
 * This namespace is arbitrary picked. It work as a seed to generate new UUIDs.
 */
export const UUIDnamespace = '0d91cfc8-9be0-4458-8f05-5bd5a5bc2fbb';

/**
 * Use a given supbaseClient and a subgraphClinet to make the required queries to
 * get and filter the contracts (InterpreterCallers).
 */
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

/**
 * Use a given supabaseCLient to query to the Database and get all the Interpreter
 * relate information like Rainterpreters, Stores and Deployers.
 */
export async function getDBInterpretersData(supabaseClient_: SupabaseClient) {
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

/**
 * Use a given subgraphClient to query to the subgraph endpoint and get all the
 * Interpreter related information like Rainterpreters, Stores and Deployers.
 * @returns
 */
export async function getSGInterpreters(subgraphClient_: Client) {
	const query = `
		{
			expressionDeployers {
				id
				bytecodeHash
				meta {
					metaBytes
					content {
						payload
						magicNumber
						contentType
						contentEncoding
						contentLanguage
					}
				}
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
 * Inverse of `deflateJson`. Get a hex string  or Uint8Array and inflate
 * the JSON to obtain an string with the decoded data.
 *
 * @param bytes - Bytes to infalte to json
 */
export const inflateJson = (bytes: unknown) => {
	if (!isBytesLike(bytes)) throw new Error('invalid bytes');
	const _uint8Arr = arrayify(bytes, { allowMissingPrefix: true });

	const inflated = inflate(_uint8Arr);
	const decoded = textDecoder.decode(inflated);
	const parsed = JSON.parse(decoded);
	return parsed;
};

/**
 * TODO: At the moment only Mumbai and Polygon
 * Return all the subgraphs endpoint that are currently on use.
 */
export function getSubgraph(): Array<{
	subgraph_url: string;
	chainId: number;
}> {
	return [
		{
			subgraph_url:
				'https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry-polygon',
			chainId: 137
		},
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
				const metaContent = manageContractMetaSg(SGcontract.meta);

				// Use the values decoded to prepare to insert
				if (metaContent) {
					// To insert the new Contracts
					contractsToAdd[contractID] = {
						id: contractID,
						abi: metaContent.abi,
						contract_meta: metaContent.contractMeta,
						metadata: buildMetadataFromMeta(metaContent.contractMeta),
						slug: SGcontract.bytecodeHash
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
				// Decoded the CBOR sequence into the opmeta (the opmeta decoded and the bytes)
				const opmetaData = manageDeployerMetaSg(SGdeployer.meta);
				// opmetaDecoded
				// const a = opsMetaMap?.get(0); //0
				// Use the values decoded to prepare to insert
				if (opmetaData) {
					// To insert the new Contracts
					deployersToAdd[deployerID] = {
						id: deployerID,
						bytecode_hash: SGdeployer.bytecodeHash,
						opmeta: opmetaData.opmetaDecoded,
						opmeta_bytes: opmetaData.opmeta_bytes
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
		const SGinterpreterInstances = SGrainterpreter.instances;
		const rainterpreterID = uuidv5(SGrainterpreter.id, UUIDnamespace);

		const rainterpreterMatched = dbRainterpreters_.find(
			(rainterpreter_) => rainterpreter_.id === rainterpreterID
		);

		if (!rainterpreterMatched) {
			// The Subgraph entity Rainterpreter work with an ID based on the bytecode_hash
			// of the contract, if there are not match on the DB means that is new contract.
			// Also, all the addresses (instances) are in the same entity, so they will
			// be directly added since a previous relation did not existed.

			// To insert the new Rainterpreters
			rainterpretersToAdd[rainterpreterID] = {
				id: rainterpreterID,
				bytecode_hash: SGrainterpreter.id
			};

			// Add all the address (instances)
			SGinterpreterInstances.forEach((interpreterInstance_) => {
				addAddress(interpreterInstance_.id, rainterpreterID);
			});
		} else {
			// If there a match, then some addresses could already added, so need to be filtered
			const DBrainterpreterAddresses = rainterpreterMatched.rainterpreter_addresses;

			// Filter the addresses (instances) from the SG that does not exist in the DB
			const addressesFiltered = SGinterpreterInstances.filter((instances_) => {
				// Generate the addressID that (will) have the rainterpreter
				const addressID = uuidv5(instances_.id + chainId.toString(), UUIDnamespace);

				// Search for those instances (address) that does not exist in the DB.
				// If the index returned is `-1`, does not exist in DB and it should be added.
				return DBrainterpreterAddresses.findIndex((address_) => address_.id == addressID) == -1;
			});

			// Add all the filtered address (instances)
			addressesFiltered.forEach((interpreterInstance_) => {
				addAddress(interpreterInstance_.id, rainterpreterID);
			});
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
		const SGstoreInstances = SGstore.instances;
		const storeID = uuidv5(SGstore.id, UUIDnamespace);

		const storeMatched = dbStores_.find((store_) => store_.id === storeID);

		if (!storeMatched) {
			// The Subgraph entity RainterpreterStore work with an ID based on the bytecode_hash
			// of the contract, if there are not match on the DB means that is new contract.
			// Also, all the addresses (instances) are in the same entity, so they will
			// be directly added since a previous relation did not existed.

			// To insert the new RainterpreterStore (store)
			storesToAdd[storeID] = {
				id: storeID,
				bytecode_hash: SGstore.id
			};

			// Add all the address (instances)
			SGstoreInstances.forEach((storeInstance_) => {
				addAddress(storeInstance_.id, storeID);
			});
		} else {
			// If there a match, then some addresses could already added, so need to be filtered
			const DBstoreAddresses = storeMatched.rainterpreter_store_addresses;

			// Filter the addresses (instances) from the SG that does not exist in the DB
			const addressesFiltered = SGstoreInstances.filter((instances_) => {
				// Generate the addressID that (will) have the store
				const addressID = uuidv5(instances_.id + chainId.toString(), UUIDnamespace);

				// Search for those instances (address) that does not exist in the DB.
				// If the index returned is `-1`, does not exist in DB and it should be added.
				return DBstoreAddresses.findIndex((address_) => address_.id == addressID) == -1;
			});

			// Add all the filtered address (instances)
			addressesFiltered.forEach((storeInstance_) => {
				addAddress(storeInstance_.id, storeID);
			});
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
				meta {
					metaBytes
					content {
						payload
						magicNumber
						contentType
						contentEncoding
						contentLanguage
					}
				}
			}
		}
	`;
	const resp = await subgraphClient_.query(query, {}).toPromise();

	if (resp.error) throw new Error(`Cannot query from SG:  ${resp.error.message}`);

	return resp.data.contracts as Array<ContractSG>;
}

/**
 * Use the meta from the SG and get the Meta content required for the Contract
 *
 */
export function manageContractMetaSg(
	meta_: MetaDocumentSG
): { abi: ABI; contractMeta: ContractMeta } | null {
	if (!meta_) return null;

	if (!meta_.content || meta_.content.length == 0) {
		if (!meta_.metaBytes) return null;

		return decodedMeta(meta_.metaBytes);
	}

	const metaContent = meta_.content;

	const mnABI = hexToDecimalString(MAGIC_NUMBERS.SolidityABI);
	const mnContractMeta = hexToDecimalString(MAGIC_NUMBERS.ContractMeta);

	const _solidityAbiContent = metaContent.find((elem) => elem.magicNumber == mnABI);
	const _contractMetaContent = metaContent.find((elem) => elem.magicNumber == mnContractMeta);

	// If some Content was not found, the data and it wil be ignored
	if (!_solidityAbiContent || !_contractMetaContent) return null;

	const solidityAbiJson = deserializeContent(_solidityAbiContent);
	const metaContentJson = deserializeContent(_contractMetaContent);

	return {
		abi: solidityAbiJson,
		contractMeta: metaContentJson
	};
}

/**
 * Use the meta from the SG and get the Meta content required for the ExpressionDeployers
 *
 */
export function manageDeployerMetaSg(
	meta_: MetaDocumentSG
	// deno-lint-ignore no-explicit-any
): { opmetaDecoded: any; opmeta_bytes: string } | null {
	if (!meta_) return null;

	if (!meta_.content || meta_.content.length == 0) {
		if (!meta_.metaBytes) return null;

		return decodedMetaOPMETA(meta_.metaBytes);
	}

	const metaContent = meta_.content;

	const mnOpsMeta = hexToDecimalString(MAGIC_NUMBERS.OpsMeta);

	const _opsMetaContent = metaContent.find((elem) => elem.magicNumber == mnOpsMeta);

	// If the Content was not found, the data and it wil be ignored
	if (!_opsMetaContent) return null;

	const opmetaDecoded = deserializeContent(_opsMetaContent);

	return {
		opmetaDecoded,
		opmeta_bytes: _opsMetaContent.payload
	};
}

export function deserializeContent(content_1: MetaContentV1SG) {
	const { payload, contentType, contentEncoding } = content_1;

	if (contentType === 'application/json') {
		if (!contentEncoding) {
			// Decode using UTF-8
			const _uint8Arr = arrayify(payload, { allowMissingPrefix: true });
			const decoded = textDecoder.decode(_uint8Arr);
			const parsed = JSON.parse(decoded);
			return parsed;
		}
		//
		else if (contentEncoding === 'deflate') {
			// Inflate JSON
			return inflateJson(payload);
		}
	} else {
		// TODO: Support more content types
		return null;
	}
}

export function hexToDecimalString(hexString_: string): string {
	hexString_ = hexString_.toLowerCase();
	if (!hexString_.startsWith('0x')) hexString_ = '0x' + hexString_;

	const decimalString = BigInt(hexString_).toString(10);
	return decimalString;
}

// Using overloading
export function filterUniqueIDs(arr_: DataContractUpload[]): DataContractUpload[];
export function filterUniqueIDs(arr_: DataDeployerUpload[]): DataDeployerUpload[];
export function filterUniqueIDs(arr_: DataRainterpreterUpload[]): DataRainterpreterUpload[];
export function filterUniqueIDs(
	arr_: DataRainterpreterStoreUpload[]
): DataRainterpreterStoreUpload[];

export function filterUniqueIDs(
	arr_: (
		| DataContractUpload
		| DataDeployerUpload
		| DataRainterpreterUpload
		| DataRainterpreterStoreUpload
	)[]
) {
	const uniqueObjects = Object.values(
		arr_.reduce(
			(
				acc: {
					[key: string]:
						| DataContractUpload
						| DataDeployerUpload
						| DataRainterpreterUpload
						| DataRainterpreterStoreUpload;
				},
				cur
			) => {
				acc[cur.id] = cur;
				return acc;
			},
			{}
		)
	);

	return uniqueObjects;
}
