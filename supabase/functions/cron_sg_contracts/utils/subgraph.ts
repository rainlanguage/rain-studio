import { ContractSG, SubgraphClient } from '../types.ts';

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
					type
					implementation {
						id
						bytecodeHash
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
