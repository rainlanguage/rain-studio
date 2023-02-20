import { json } from '@sveltejs/kit';
import { createClient } from '@urql/core';
import { Subgraphs } from '$lib/utils';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	//	Only mumbai at the moment
	const client = createClient({
		url: Subgraphs[0].endpoints.interpreters
	});

	const query = `
		query {
			expressionDeployers {
				id
			}
		}
	`;

	const { data, error } = await client.query(query, {}).toPromise();

	if (error || !data) return [];

	const interpreterAddresses = data.expressionDeployers.map((elem) => elem.id);

	return json({ interpreterAddresses });
}
