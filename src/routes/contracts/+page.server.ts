import { Subgraphs } from '$lib/utils';
import { formatContract } from '$lib/utils/meta';
import { error } from '@sveltejs/kit';
import { createClient } from '@urql/core';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	//	Only mumbai at the moment
	const mumbaiClient = createClient({
		url: Subgraphs[0].endpoints.interpreters
	});

	const querySg = `
		query {
			contracts {
				id
				deployTransaction {
					id
				}
				meta
				expressions {
					id
				}
			}
		}
	`;

	const { data: dataSg, error: errorSg } = await mumbaiClient.query(querySg, {}).toPromise();

	if (errorSg) throw error(404, 'Not found');

	const contracts = formatContract(dataSg.contracts);

	return { contracts };
}
