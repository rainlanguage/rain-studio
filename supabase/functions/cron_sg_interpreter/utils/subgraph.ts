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
 * @public
 *
 * Use a given subgraphClient to query to the subgraph endpoint and get all the
 * Interpreter related information like Rainterpreters, Stores and Deployers.
 * @returns
 */
export async function getSGInterpreters(subgraphClient_: SubgraphClient) {
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
