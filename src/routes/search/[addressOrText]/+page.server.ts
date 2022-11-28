import { error, json } from '@sveltejs/kit';
import { createClient } from '@urql/core';
import { ethers } from 'ethers';
import { supabaseClient } from '$lib/supabaseClient';

import {
	subgraphs,
	accountQuery,
	factoryQuery,
	contractQuery,
	interpreterQuery,
	expresionQuery
} from './constants';

import type { DataResponse } from './types';

// TODO: Redirect to the page based on type response (?)
// TODO: Support to search transactions
// TODO: Improve to search multi chain

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { addressOrText } = params;
	console.log(addressOrText);

	const client = createClient({
		url: subgraphs[0].url
	});

	if (!addressOrText) {
		return { result: null };
	}

	if (ethers.utils.isAddress(addressOrText.toLowerCase())) {
		// Search address
		const address = addressOrText.toLowerCase();

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

		const { data, error } = await client.query(query, { address }).toPromise();

		if (error) {
			console.log(error);
			return { result: null };
			// return {result: 'Something happened with the query. Please, try again'};
		}

		const resultQuery = Object.values(data).filter((element) => element)[0];

		// TODO: Function to normalise the data according to the "__typename" of the result.
		// const result = normalizeData();

		console.log(resultQuery);

		return { result: resultQuery };
	} else {
		// Search text
		return { result: null };
	}
}
