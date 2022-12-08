import { supabaseClient } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import { ethers } from 'ethers';
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
	const query = `
		query GetAllExpressions {
			expressions {
				id
				contextScratch
				config {
					id
					sources
					constants
				}
				account {
					id
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
	const testQuery = await client.query(query, {}).toPromise();

	recentExpressions = testQuery.data.expressions;
	recentExpressions.sort(sortExpressions);
	///////////////////////////////////////////////////////////////////////

	// Query to supabase DB if the account.id is an registered user
	const _accounts = recentExpressions.map((expression_) =>
		// Checksum the address since it's stored on this form in DB
		ethers.utils.getAddress(expression_.account.id)
	);

	const accountsQuery = await supabaseClient
		.from('wallets')
		.select('address, profiles(username, avatar_url)')
		.in('address', _accounts);

	if (accountsQuery.error) throw error(500, 'Something went wrong :(');

	const _accountsData = {};

	accountsQuery.data.forEach((account_) => {
		_accountsData[account_.address.toLowerCase()] = {
			username: account_.profiles.username,
			avatar_url: account_.profiles.avatar_url
		};
	});

	return {
		contract: contractQuery.data,
		interpreters: interpretersQuery.data,
		expressionSG: testQuery.data.expressions,
		accountsData: _accountsData
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
