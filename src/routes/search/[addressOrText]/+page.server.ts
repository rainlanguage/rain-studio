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

import type { ContractDBResponse, AccountDBResponse } from './types';

// TODO: Redirect to the page based on type response (?)
// TODO: Support to search transactions
// TODO: Improve to search multi chain

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { addressOrText } = params;

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

		const resultSG = Object.values(data).filter((element) => element)[0];
		if (!resultSG) return { result: null };

		const resultDB = await queryToDatabase(address, resultSG.__typename);

		// TODO: Function to normalise the data according to the "__typename" of the result into `result`
		return { resultSG, resultDB };
	} else {
		const text = addressOrText.toLowerCase();
		const nameExpreResult = await queryNameExpressionDB(text);
		const nameContractResult = await queryNameContractDB(text);

		let data = [];
		if (nameExpreResult.data) {
			data = data.concat(nameExpreResult.data);
		}
		if (nameContractResult.data) {
			data = data.concat(nameContractResult.data);
		}

		if (data.length > 0) {
			return { resultText: data };
		}

		return { resultText: null };
	}
}

const queryToDatabase = async (address: string, type: string) => {
	if (type == 'Contract' || type == 'Factory') {
		return queryContractDB(address);
	}

	if (type == 'Account') {
		return queryAccountDB(address);
	}

	if (type == 'Interpreter') {
		return queryInterpreterDB(address);
	}

	return { data: null };
};

const queryContractDB = async (address: string): Promise<{ data: ContractDBResponse | null }> => {
	const { error, data } = await supabaseClient
		.from('contracts')
		.select('*, project(*)')
		.contains(
			'metadata->addresses',
			JSON.stringify([
				{
					knownAddresses: [ethers.utils.getAddress(address)]
				}
			])
		);

	if (error || data.length == 0) {
		return { data: null };
	}

	return { data };
};

const queryAccountDB = async (address: string): Promise<{ data: AccountDBResponse | null }> => {
	const { error, data } = await supabaseClient
		.from('wallets')
		.select('*, user_id(*)')
		.eq('address', ethers.utils.getAddress(address))
		.single();

	if (error || data.length == 0) {
		return { data: null };
	}

	return { data };
};

const queryInterpreterDB = async (
	address: string
): Promise<{ data: ContractDBResponse | null }> => {
	const { error, data: dataDB } = await supabaseClient.from('interpreters').select('*');

	if (error || dataDB.length == 0) {
		return { data: null };
	}

	// TODO: Improve with a RPC query to supabase
	const data = dataDB.find((ele) => {
		return ele.metadata.addresses.find((addresses) => {
			return addresses.knownAddresses.find((knownAddresses) => {
				if (knownAddresses.interpreter.toLowerCase() == address.toLowerCase()) return true;
			});
		});
	});

	return { data };
};

// Mutl response
const queryNameContractDB = async (name: string) => {
	const { error, data } = await supabaseClient
		.from('contracts')
		// .select('id, created_at, slug, project(*),metadata')
		.select('id, slug')
		.textSearch('slug', name);

	if (error || data.length == 0) {
		return { data: null };
	}

	return { data };
};

const queryNameExpressionDB = async (name: string) => {
	const { error, data } = await supabaseClient
		.from('draft_expressions')
		.select('id, name')
		// .select('*, user_id(*), interpreter(*)')
		.textSearch('name', name);

	if (error || data.length == 0) {
		return { data: null };
	}

	return { data };
};
