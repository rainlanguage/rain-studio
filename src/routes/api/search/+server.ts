/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { createClient } from '@urql/core';
import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';
import { matchInterpreters } from '$lib/match-addresses';

import {
	subgraphs,
	accountQuery,
	factoryQuery,
	contractQuery,
	interpreterQuery,
	expresionQuery
} from './constants';

// TODO: Improve to search multi chain
// TODO: Improve the format of the data response (?)

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request } = event;
	const { supabaseClient } = await getSupabase(event);

	const { addressOrText } = await request.json();

	//	Only mumbai at the moment
	const client = createClient({
		url: subgraphs[0].url
	});

	if (!addressOrText) {
		return json({ success: false, result: null });
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
			return json({ success: false, result: null });
		}

		let resultSG = Object.values(data).filter((element) => element)[0]; //Could undefined
		let resultDB = { data: null };

		if (resultSG) {
			// Found something on sg
			resultDB = await queryToDatabase(address, resultSG.__typename, supabaseClient);

			if (resultSG.__typename.match(/^(Contract|Factory|Expression)$/) && resultDB.data == null) {
				// Does not found anything on DB
				return json({
					success: true,
					result: { resultSG: null, resultDB: null }
				});
			}
			resultSG = { data: resultSG };
		} else {
			resultSG = { data: null };
			resultDB = await queryToDatabase(address, 'All', supabaseClient);
		}

		return json({ success: true, result: { resultSG: resultSG.data, resultDB: resultDB.data } });
	} else if (ethers.utils.isHexString(addressOrText.toLowerCase())) {
		// Search a transaction
		const hash = addressOrText.toLowerCase();
		const query = `
			query ($hash: ID!) {
				transaction (id: $hash) {
					id
					timestamp
					blockNumber
					events {
						id
						timestamp
						emitter {
							id
						}
					}
				}
			}
		`;

		const { data, error } = await client.query(query, { hash }).toPromise();

		if (error) {
			console.log(error);
			return json({ success: false, result: null });
		}

		return json({ success: true, result: { resultSG: data.transaction } });
	} else {
		const text = addressOrText.toLowerCase();
		const nameExpreResult = await queryNameExpressionDB(text, supabaseClient);
		const nameContractResult = await queryNameContractDB(text, supabaseClient);

		let response = [];
		let success = false;

		if (nameExpreResult.data) {
			response = response.concat(nameExpreResult.data);
		}

		if (nameContractResult.data) {
			response = response.concat(nameContractResult.data);
		}

		if (response.length > 0) success = true;

		return json({ success, result: response });
	}
}

const queryToDatabase = async (address: string, type: string, supabaseClient_: any) => {
	if (type == 'All') {
		const contractsResp = await queryContractDB(address, supabaseClient_);
		if (contractsResp.data) {
			return contractsResp;
		}

		const accountsResp = await queryAccountDB(address, supabaseClient_);
		if (accountsResp.data) {
			return accountsResp;
		}

		const interpretersResp = await queryInterpreterDB(address, supabaseClient_);
		if (interpretersResp.data) {
			return interpretersResp;
		}

		return { data: null };
	}

	if (type == 'Contract' || type == 'Factory') {
		return queryContractDB(address, supabaseClient_);
	}

	if (type == 'Account') {
		return queryAccountDB(address, supabaseClient_);
	}

	if (type == 'Interpreter') {
		return queryInterpreterDB(address, supabaseClient_);
	}

	return { data: null };
};

const queryContractDB = async (
	address: string,
	supabaseClient_: any
): Promise<{ data: ContractDBResponse | null }> => {
	const { error, data } = await supabaseClient_
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

	const dataResp = data[0];

	// Could be Contract or Factory (?)
	dataResp.type = 'Contract';

	return { data: dataResp };
};

const queryAccountDB = async (
	address: string,
	supabaseClient_: any
): Promise<{ data: AccountDBResponse | null }> => {
	const { error, data } = await supabaseClient_
		.from('wallets')
		.select('*, user_id(*)')
		.eq('address', ethers.utils.getAddress(address))
		.single();

	if (error || data.length == 0) {
		return { data: null };
	}
	data.type = 'Account';

	return { data };
};

const queryInterpreterDB = async (
	address: string,
	supabaseClient_: any
): Promise<{ data: ContractDBResponse | null }> => {
	const data = (await matchInterpreters([address.toLowerCase()], supabaseClient_))[0];
	data.type = 'Interpreter';

	return { data };
};

// Mutl response
const queryNameContractDB = async (name: string, supabaseClient_: any) => {
	const { error, data } = await supabaseClient_
		.from('contracts')
		// .select('id, created_at, slug, project(*),metadata')
		.select('id, slug')
		.textSearch('slug', name);

	if (error || data.length == 0) {
		return { data: null };
	}

	return { data };
};

const queryNameExpressionDB = async (name: string, supabaseClient_: any) => {
	const { error, data } = await supabaseClient_
		.from('draft_expressions')
		.select('id, name')
		// .select('*, user_id(*), interpreter(*)')
		.textSearch('name', name);

	if (error || data.length == 0) {
		return { data: null };
	}

	return { data };
};
