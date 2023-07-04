import { buildMetadataFromMeta } from './index.ts';
import { UUIDnamespace, uuidv5 } from './uuid.ts';
import type { ContractDB, ContractSG, DataAddressUpload, DataContractUpload } from '../types.ts';
import { manageContractMetaSg } from './meta.ts';

/**
 * @public
 * Filter the data from Database and the Subgraph prior insert to avoid already
 * added data.
 */
export function filterNonAddedContracts(
	sgContracts_: Array<ContractSG>,
	dbContracts_: ContractDB[],
	chain_id: number
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
	function addAddress(contractData: ContractSG, contractId_: string) {
		const { id: address, type, implementation } = contractData;
		const contractAddressID = uuidv5(address + chain_id.toString(), UUIDnamespace);

		addressesToAdd[contractAddressID] = {
			id: contractAddressID,
			address: address,
			chain_id: chain_id,
			contract: contractId_,
			type: type
		};

		// If this contract address is a minima; proxy, then should be assigned the
		// implementation
		if (type == 'proxy' && implementation) {
			// Creating the UUID ID for the implementation
			const implementationAddressID = uuidv5(
				implementation.id + chain_id.toString(),
				UUIDnamespace
			);

			addressesToAdd[contractAddressID].implementation = implementationAddressID;
		}
	}

	for (let i = 0; i < sgContracts_.length; i++) {
		const SGcontract = sgContracts_[i];
		let contractID: string;

		// It's a proxy. The UUID should be the implementation bytecode hash UUID, not
		// the bytecode hash UUID of the proxy
		if (SGcontract.type == 'proxy' && SGcontract.implementation) {
			contractID = uuidv5(SGcontract.implementation.bytecodeHash, UUIDnamespace);
		} else {
			contractID = uuidv5(SGcontract.bytecodeHash, UUIDnamespace);
		}

		const contractMatched = dbContracts_.find((contract_) => contract_.id === contractID);

		if (!contractMatched) {
			// Check if it is already cached
			if (contractsToAdd[contractID]) {
				// Add to contract_address table with the reference to `contractID` because a matched was not found before
				addAddress(SGcontract, contractID);
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
					addAddress(SGcontract, contractID);
				}
			}
		} else {
			const addressID = uuidv5(SGcontract.id + chain_id.toString(), UUIDnamespace);

			const addressContract = contractMatched.contract_addresses_new.find(
				(item_) => item_.id === addressID
			);

			// If does not exist in the DB, prepare data to insert
			if (!addressContract) {
				addAddress(SGcontract, contractID);
			}
		}
	}

	return { contractsToAdd, addressesToAdd };
}

/**
 * @public
 * Filter an array to remove any duplicated items.
 *
 * @dev
 * This function is useful after all the queries and other filters are done.
 * This is because when the chains are different between filters, it could be
 * duplicated entries on non-chain data like `contract` entities. With entities
 * that are strictly generated for each chain, like `contract_address`, this will
 * not happens since their ID is generated with the chain_id.
 */
export function filterUniqueIDs(arr_: DataContractUpload[]): DataContractUpload[] {
	const uniqueObjects = Object.values(
		arr_.reduce(
			(
				acc: {
					[key: string]: DataContractUpload;
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
