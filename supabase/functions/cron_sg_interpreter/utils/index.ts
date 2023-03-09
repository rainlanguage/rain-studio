/* eslint-disable @typescript-eslint/no-explicit-any */

import { arrayify, isBytesLike, inflate, uuidv5 } from '../deps.ts';
import { decodedMeta } from './rainDocuments.ts';

import type { Client } from 'https://esm.sh/v111/@urql/core@3.2.0';
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0-rc.12';
import type {
	ContractSG,
	ContractDB,
	Metadata,
	ContractMeta,
	DataContractUpload,
	DataAddressUpload
} from '../types.ts';

export * from './rainDocuments.ts';
export const textDecoder = new TextDecoder();
export const UUIDnamespace = '0d91cfc8-9be0-4458-8f05-5bd5a5bc2fbb';

export async function getDBContracts(supabaseClient_: SupabaseClient): Promise<ContractDB[]> {
	const resp = await supabaseClient_.from('contracts_new').select('*, contract_addresses_new(*)');
	if (resp.error) throw new Error(`Cannot query query from DB:  ${resp.error}`);

	return resp.data;
}

export async function getSGContracts(subgraphClient_: Client): Promise<ContractSG[]> {
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
