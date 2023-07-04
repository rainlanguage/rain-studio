import { UUIDnamespace, uuidv5 } from './uuid.ts';
import type {
	DataDeployerAddressUpload,
	DataDeployerUpload,
	DataRainterpreterAddressUpload,
	DataRainterpreterStoreAddressUpload,
	DataRainterpreterStoreUpload,
	DataRainterpreterUpload,
	DeployerDB,
	ExpressionDeployerSG,
	InterpreterSG,
	RainterpreterDB,
	RainterpreterStoreSG,
	Rainterpreter_storesDB
} from '../types.ts';
import { manageDeployerMetaSg } from './meta.ts';

/**
 * @public
 * Filter the data from Database and the Subgraph prior insert to avoid already
 * added data.
 */
export function filterNonAddedDeployers(
	sgDeployers_: ExpressionDeployerSG[],
	dbDeployers_: DeployerDB[],
	chain_id: number
) {
	const deployersToAdd: {
		[key: string]: DataDeployerUpload;
	} = {};

	const deployersAddressesToAdd: {
		[key: string]: DataDeployerAddressUpload;
	} = {};

	/**
	 * Add a new address to `deployersAddressesToAdd` using this local scope
	 *
	 * @param address_ The ExpressionDeployer address
	 * @param deployerId_ The deployer ID that will have the relation with this
	 * address. The ID is genenrated from the bytecode hash and an UUID namespace.
	 * @param interpreter_ The Rainterpreter instance ID that is used with this Expression
	 * deployer. The ID is generated from a combination of the address with the chainID
	 * plus an UUID namespace.
	 * @param store The Store interpreter instance ID that is used with this Expression
	 * deployer. The ID is generated from a combination of the address with the chainID
	 * plus an UUID namespace.
	 */
	function addAddress(address_: string, deployerId_: string, interpreter_: string, store: string) {
		const addressID = uuidv5(address_ + chain_id.toString(), UUIDnamespace);
		const interpreterID = uuidv5(interpreter_ + chain_id.toString(), UUIDnamespace);
		const storeID = uuidv5(store + chain_id.toString(), UUIDnamespace);

		deployersAddressesToAdd[addressID] = {
			id: addressID,
			deployer: deployerId_,
			address: address_,
			chain_id: chain_id,
			interpreter_address: interpreterID,
			store_address: storeID
		};
	}

	for (let i = 0; i < sgDeployers_.length; i++) {
		const SGdeployer = sgDeployers_[i];
		const deployerID = uuidv5(SGdeployer.bytecodeHash, UUIDnamespace);

		const deployerMatched = dbDeployers_.find((deployer_) => deployer_.id === deployerID);

		if (!deployerMatched) {
			// Check if it is already cached
			if (deployersToAdd[deployerID]) {
				// Add to deployer addresses table with the reference to `deployerID` because a matched was not found before
				addAddress(SGdeployer.id, deployerID, SGdeployer.interpreter.id, SGdeployer.store.id);
			} else {
				// Decoded the CBOR sequence into the opmeta (the opmeta decoded and the bytes)
				const opmetaData = manageDeployerMetaSg(SGdeployer.meta);
				// opmetaDecoded
				// const a = opsMetaMap?.get(0); //0
				// Use the values decoded to prepare to insert
				if (opmetaData) {
					// To insert the new Deployers
					deployersToAdd[deployerID] = {
						id: deployerID,
						bytecode_hash: SGdeployer.bytecodeHash,
						opmeta: opmetaData.opmetaDecoded,
						opmeta_bytes: opmetaData.opmeta_bytes,
						opmeta_hash: SGdeployer.opmetaHash
					};

					// To insert the new address with the Deployer referece
					addAddress(SGdeployer.id, deployerID, SGdeployer.interpreter.id, SGdeployer.store.id);
				}
			}
		} else {
			const addressID = uuidv5(SGdeployer.id + chain_id.toString(), UUIDnamespace);

			const addressDeployer = deployerMatched.deployers_addresses.find(
				(item_) => item_.id === addressID
			);

			// If does not exist in the DB, prepare data to insert
			if (!addressDeployer) {
				addAddress(SGdeployer.id, deployerID, SGdeployer.interpreter.id, SGdeployer.store.id);
			}
		}
	}

	return { deployersToAdd, deployersAddressesToAdd };
}

/**
 * @public
 * Filter the data from Database and the Subgraph prior insert to avoid already
 * added data.
 */
export function filterNonAddedRainterpreters(
	sgRainterpreters_: InterpreterSG[],
	dbRainterpreters_: RainterpreterDB[],
	chain_id: number
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
		const addressID = uuidv5(address_ + chain_id.toString(), UUIDnamespace);
		rainterpreterAddressesToAdd[addressID] = {
			id: addressID,
			rainterpreter: rainterpreterId_,
			address: address_,
			chain_id: chain_id
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
			// of the rainterpreter, if there are not match on the DB means that is new
			// rainterpreter. Also, all the addresses (instances) are in the same entity,
			// so they will be directly added since a previous relation did not existed.

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
				const addressID = uuidv5(instances_.id + chain_id.toString(), UUIDnamespace);

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

/**
 * @public
 * Filter the data from Database and the Subgraph prior insert to avoid already
 * added data.
 */
export function filterNonAddedStores(
	sgStores_: RainterpreterStoreSG[],
	dbStores_: Rainterpreter_storesDB[],
	chain_id: number
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
		const addressID = uuidv5(address_ + chain_id.toString(), UUIDnamespace);
		storeAddressesToAdd[addressID] = {
			id: addressID,
			rainterpreter_store: storeId_,
			address: address_,
			chain_id: chain_id
		};
	}

	for (let i = 0; i < sgStores_.length; i++) {
		const SGstore = sgStores_[i];
		const SGstoreInstances = SGstore.instances;
		const storeID = uuidv5(SGstore.id, UUIDnamespace);

		const storeMatched = dbStores_.find((store_) => store_.id === storeID);

		if (!storeMatched) {
			// The Subgraph entity RainterpreterStore work with an ID based on the bytecode_hash
			// of the interpreter store, if there are not match on the DB means that is
			//  new interpreter store. Also, all the addresses (instances) are in the
			// same entity, so they will be directly added since a previous relation
			// did not existed.

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
				const addressID = uuidv5(instances_.id + chain_id.toString(), UUIDnamespace);

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

/**
 * @public
 * Filter an array to remove any duplicated items.
 *
 * @dev
 * This function is useful after all the queries and other filters are done.
 * This is because when the chains are different between filters, it could be
 * duplicated entries on non-chain data like `deployers` entities. With entities
 * that are strictly generated for each chain, like `deployer_address`, this will
 * not happens since their ID is generated with the chain_id.
 */
export function filterUniqueIDs(arr_: DataDeployerUpload[]): DataDeployerUpload[];

/**
 * @public
 * Filter an array to remove any duplicated items.
 *
 * @dev
 * This function is useful after all the queries and other filters are done.
 * This is because when the chains are different between filters, it could be
 * duplicated entries on non-chain data like `rainterpreter` entities. With entities
 * that are strictly generated for each chain, like `rainterpreter_address`, this will
 * not happens since their ID is generated with the chain_id.
 */
export function filterUniqueIDs(arr_: DataRainterpreterUpload[]): DataRainterpreterUpload[];

/**
 * @public
 * Filter an array to remove any duplicated items.
 *
 * @dev
 * This function is useful after all the queries and other filters are done.
 * This is because when the chains are different between filters, it could be
 * duplicated entries on non-chain data like `rainterpreterStore` entities. With entities
 * that are strictly generated for each chain, like `rainterpreterStore_address`, this will
 * not happens since their ID is generated with the chain_id.
 */
export function filterUniqueIDs(
	arr_: DataRainterpreterStoreUpload[]
): DataRainterpreterStoreUpload[];

// Using overloading
export function filterUniqueIDs(
	arr_: (DataDeployerUpload | DataRainterpreterUpload | DataRainterpreterStoreUpload)[]
) {
	const uniqueObjects = Object.values(
		arr_.reduce(
			(
				acc: {
					[key: string]:
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
