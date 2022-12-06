import { supabaseClient } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { createClient } from '@urql/core';
import { Subgraphs, QueryGetKnowContracts } from '$lib/utils';

export const load: PageServerLoad = async ({ params }) => {
	const contractQuery = await supabaseClient
		.from('contracts')
		.select('project ( * ), *')
		.eq('slug', params.slug)
		.single();

	if (contractQuery.error) throw error(404, 'Not found');

	const interpretersQuery = await supabaseClient.from('interpreters').select('*');

	if (interpretersQuery.error) throw error(500, 'Something went wrong :(');

	/**
	 * ChainID to filter. This could be use later to specify which subgraph use
	 */
	//  TODO: Only supporting Mumbai by now
	const chainId = 80001;

	/**
	 * Aaddresses filtered with the proper chain ID in an array
	 */
	const addresses = contractQuery.data.metadata.addresses
		.filter((element) => element.chainId == chainId)
		.map((element) => element.knownAddresses)
		.flat();

	//	Only mumbai at the moment
	const client = createClient({
		url: Subgraphs[0].url
	});

	let recentExpressions = [];
	const { data, error } = await client
		.query(QueryGetKnowContracts, { knowAddresses: addresses })
		.toPromise();

	if (data) {
		recentExpressions = data.contracts.map((ele) => ele.expressions).flat();
		recentExpressions.sort(sortExpressions);
	}

	///////////////////////////////////////////// Test design data
	/**
	 * Expression from SG to obtain values
	 */
	const addressess2 = [
		'0x0965e93d173f81adc40639c157c8068cb643dc06',
		'0x0d5ae7a921afff72caa42355df1c406ba58b1e4d',
		'0x0e09db16ab0efd7697686d796c777af71e095aba',
		'0x1d0ba8ce6bdb11a75e0f73120df6c0321bdeb045',
		'0x1e9f8ef0788dd9ca3ce5bd26e956ea873dd8f19b',
		'0x24189c368aa49c121d46441011641308b0f7dd9b',
		'0x59f871ba7bdf91549982f6ab2a6e311e68fe34c4',
		'0x5c39eb1ff92842055a4f0631d2ae2a4b97c900a1',
		'0x9e5853d7c7814443b3cfe93fbddb1bd7b9953d3e',
		'0xa1f97170d37c5b87e68c0917598fa5aa08de7ea9',
		'0xa9c163abc6df1587b59b137b51af0e07761d0aee',
	];

	const query = `
		query MyQuery($addresses: [ID!]) {
			expressions(where: {id_in: $addresses}) {
				id
				contextScratch
				config {
					id
					sources
					constants
				}
				event {
					id
					transaction {
						id
						timestamp
						blockNumber
					}
				}
				sender {
					id
					deployTransaction {
						id
						timestamp
						blockNumber
					}
				}
				interpreter {
					id
				}
				interpreterInstance {
					id
				}
			}
		}
	`;

	const testQuery = await client.query(query, { addresses: addressess2 }).toPromise();

	const expressions = testQuery.data.expressions;
	expressions.sort(sortExpressions);
	///////////////////////////////////////////////////////////////////////

	return {
		contract: contractQuery.data,
		interpreters: interpretersQuery.data,
		expressionSG: testQuery.data.expressions
		// expressionSG: recentExpressions,
	};
};

/**
 * Sort expression from recents to olders
 */
function sortExpressions(a, b) {
	const timeA = a.event.transaction.timestamp;
	const timeB = b.event.transaction.timestamp;
	if (timeA > timeB) {
		return -1;
	}
	if (timeA < timeB) {
		return 1;
	}
	return 0;
}
