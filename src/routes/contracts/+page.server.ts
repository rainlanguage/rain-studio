import { Subgraphs } from '$lib/utils';
import { formatContract } from '$lib/utils/meta';
import { error } from '@sveltejs/kit';
import { createClient } from '@urql/core';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	let contracts: null | any[] = null;

	//	Only mumbai at the moment
	const client = createClient({
		url: Subgraphs[0].endpoints.interpreters
	});

	const querySg = `
		query {
			contracts {
				id
				opmeta
			}
		}
	`;

	const { data: dataSg, error: errorSg } = await client.query(querySg, {}).toPromise();

	if (errorSg) throw error(404, 'Not found');

	contracts = formatContract(dataSg.contracts);

	return { contracts };
}
