import {
	ContractSG,
	ExpressionDeployerSG,
	InterpreterSG,
	RainterpreterStoreSG,
	SubgraphClient
} from '../types.ts';

/**
 * @public
 * Return all the subgraphs endpoint that are currently on use.
 *
 * @dev @todo
 * TODO: At the moment only Mumbai and Polygon
 */
export function getSubgraph(): Array<{
	subgraph_url: string;
	chain_id: number;
}> {
	return [
		{
			subgraph_url:
				'https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry-polygon',
			chain_id: 137
		},
		{
			subgraph_url: 'https://api.thegraph.com/subgraphs/name/rainprotocol/interpreter-registry',
			chain_id: 80001
		}
	];
}

/**
 * @public
 * Use the subgraph client with and valid Interpreter SG endpoint to query the
 * necessary contracts data.
 *
 * @param subgraphClient_
 * @returns
 */
export async function getSGContracts(subgraphClient_: SubgraphClient): Promise<ContractSG[]> {
	/**
	 * Al the contract queried ready to be used
	 */
	let contracts: ContractSG[] = [];

	/**
	 * Last ID to use to compared on the query. Always start with an empty ID, so
	 * it will return all the available data above an 'nullish' value, then assign it
	 * to query ID "greater than" the lastID
	 */
	let lastId = '';

	/**
	 * Variable to manage the iteration and when stop or continue
	 */
	let needExec = true;

	// Executed until there are no more availables data to query

	while (needExec) {
		const query = `
			{
				contracts(first: 1000, where: { id_gt: "${lastId}" }) {
					id
					bytecodeHash
					contractMetaHash
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

		const contractQueried = resp.data.contracts as Array<ContractSG>;

		// If there are data returned, we save it.
		// Otherwise, stop the iteration.
		if (contractQueried.length) {
			// Combine and assign the origin array with the new data.
			contracts = contracts.concat(contractQueried);

			// And we change the lastId to last item ID, so we can query starting from that ID.
			lastId = contractQueried[contractQueried.length - 1].id;
		} else {
			// The query is empty, so there is no more data not queried
			needExec = false;
		}
	}

	return contracts;
}

/**
 * @public
 *
 * Use a given subgraphClient to query to the subgraph endpoint and get all the
 * Interpreter related information like Rainterpreters, Stores and Deployers.
 * @returns
 */
export async function getSGInterpreters(subgraphClient_: SubgraphClient) {
	// The arrays with the entities data
	let deployersSG: ExpressionDeployerSG[] = [];
	let rainterpretersSG: InterpreterSG[] = [];
	let rainterpreter_storesSG: RainterpreterStoreSG[] = [];

	// Last ID to query for each entity
	let lastDeployerId = '';
	let lastinterpreterId = '';
	let lastStoreId = '';

	/**
	 * Variable to manage the iteration and when stop or continue
	 */
	let needExec = true;

	while (needExec) {
		const query = `
			{
				expressionDeployers(first: 1000, where: {id_gt: "${lastDeployerId}"}) {
					id
					bytecodeHash
					opmeta
					opmetaHash
					interpreter {
						id
					}
					store {
						id
					}
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
				interpreters (first: 1000, where: {id_gt: "${lastinterpreterId}"}) {
					id
					instances {
						id
					}
				}
				rainterpreterStores (first: 1000, where: {id_gt: "${lastStoreId}"}) {
					id
					instances {
						id
					}
				}
			}
		`;

		const resp = await subgraphClient_.query(query, {}).toPromise();

		if (resp.error) throw new Error(`Cannot query from SG:  ${resp.error.message}`);

		// The arrays with the entities queried data
		const deployersQueried = resp.data.expressionDeployers as Array<ExpressionDeployerSG>;
		const rainterpretersQueried = resp.data.interpreters as Array<InterpreterSG>;
		const rainterpreterStoresQueried = resp.data.rainterpreterStores as Array<RainterpreterStoreSG>;

		// Save and check deployers
		if (deployersQueried.length) {
			// Combine and assign the origin array with the new data.
			deployersSG = deployersSG.concat(deployersQueried);

			// And we change the lastId to last item ID, so we can query starting from that ID.
			lastDeployerId = deployersQueried[deployersQueried.length - 1].id;
		}

		// Save and check rainterpreter
		if (rainterpretersQueried.length) {
			// Combine and assign the origin array with the new data.
			rainterpretersSG = rainterpretersSG.concat(rainterpretersQueried);

			// And we change the lastId to last item ID, so we can query starting from that ID.
			lastinterpreterId = rainterpretersQueried[rainterpretersQueried.length - 1].id;
		}

		// Save and check rainterpreterStore
		if (rainterpreterStoresQueried.length) {
			// Combine and assign the origin array with the new data.
			rainterpreter_storesSG = rainterpreter_storesSG.concat(rainterpreterStoresQueried);

			// And we change the lastId to last item ID, so we can query starting from that ID.
			lastStoreId = rainterpreterStoresQueried[rainterpreterStoresQueried.length - 1].id;
		}

		// If the length of all entities are empty, means that there are no more data
		// available to query.
		// Since we are using the 'last ID' on each entity that MUST BE greater than
		// a given ID, means that if we reach the last entity on a query, then the next
		// response will not have any data, so this ensure that in some point the query
		// will be empty on each entity
		if (
			deployersQueried.length == 0 &&
			rainterpretersQueried.length == 0 &&
			rainterpreterStoresQueried.length == 0
		) {
			needExec = false;
		}
	}

	return {
		deployersSG,
		rainterpretersSG,
		rainterpreter_storesSG
	};
}
