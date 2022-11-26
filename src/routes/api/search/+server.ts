import { createClient } from '@urql/core';
import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';
import {
	subgraphs,
	accountQuery,
	factoryQuery,
	contractQuery,
	interpreterQuery,
	expresionQuery
} from './constants';

import type { SearchResponse } from './types';

function returnError(message: string): SearchResponse {
	return json({ success: false, error: { message } });
}

// TODO: Support to search transactions
// TODO: Improve to search multi chain

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request } = event;

	const client = createClient({
		url: subgraphs[0].url
	});

	const { address } = await request.json();

	if (!address) {
		return returnError('An address or text (string) must be provided to search.');
	}

	if (ethers.utils.isAddress(address.toLowerCase())) {
		// Search address
		const _address = address.toLowerCase();

		const query = `
		query ($address: ID!) {
			account(id: $address) {
				${accountQuery}
			}
			factory(id: $address) {
				${factoryQuery}
			}
			contract(id: $address) {
				${contractQuery}
			}
			interpreter(id: $address) {
				${interpreterQuery}
			}
			expression(id: $address) {
				${expresionQuery}
			}
		}
	`;

		const { data, error } = await client.query(query, { address: _address }).toPromise();

		if (error) {
			console.log(error);
			return returnError('Something happened with the query. Please, try again');
		}

		const resultQuery = Object.values(data).filter((element) => element)[0];

		// TODO: Function to normalise the data according to the "__typename" of the result.
		// const result = normalizeData();

		return json({ success: true, data: resultQuery });
	} else {
		// Search text
	}

	return json({ success: false });
}
