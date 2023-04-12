import { supabaseClient } from '$lib/supabaseClient';
import { ethers } from 'ethers';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

import type { PageServerLoad } from './$types';
import type { UserLikes, ExpressionLikes, AccountData } from './types';

import { createClient } from '@urql/core';
import { Subgraphs, QueryGetKnowContracts } from '$lib/utils';
import { error } from '@sveltejs/kit';

//  TODO: Support multichain - crosschain. At the moment, it's only supporting Mumbai.

/**
 * ChainID to filter. This could be use later to specify which subgraph use
 */
const chainId = 80001;

/**
 * Sort expression from recents to olders
 */
const sortExpressions = (a, b) => {
	const timeA = a.event.transaction.timestamp;
	const timeB = b.event.transaction.timestamp;
	if (timeA > timeB) {
		return -1;
	}
	if (timeA < timeB) {
		return 1;
	}
	return 0;
};

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
	const { params } = event;
	const session = await getServerSession(event);

	const _userLikes: UserLikes = {};
	const _expressionLikes: ExpressionLikes = {};
	const _accountsData: AccountData = {};
	let recentExpressions = [];

	const contractQuery = await supabaseClient
		.from('contracts_new')
		.select('*, contract_addresses_new(*)')
		.eq('slug', params.slug)
		.single();

	if (contractQuery.error) throw error(404, 'Not found');

	const deployersQuery = await supabaseClient.from('deployers_addresses').select('*, deployer(opmeta_bytes)');
	if (deployersQuery.error) throw error(500, 'Something went wrong :(');
	const deployerData = deployersQuery.data.map((deployer) => ({ ...deployer, opmeta: deployer.deployer.opmeta_bytes }));

	// Aaddresses filtered with the proper chain ID in an array
	const addresses = contractQuery.data.contract_addresses_new ? contractQuery.data.contract_addresses_new
		.filter((element) => element.chainId == chainId)
		.map((element) => element.knownAddresses)
		.flat() : null;

	//	Only mumbai at the moment
	const client = createClient({
		url: Subgraphs[0].url
	});

	const knowContractsQuery = await client
		.query(QueryGetKnowContracts, { knowAddresses: addresses })
		.toPromise();

	if (knowContractsQuery.data) {
		recentExpressions = knowContractsQuery.data.contracts.map((ele) => ele.expressions).flat();
		recentExpressions.sort(sortExpressions);
	}

	///////////////////////////////////////////// Test design data

	// Expression from SG to obtain values
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

	// Check on DB if the expression_.account.id is an regirtered user, saving the username and avatar.
	const _accounts = recentExpressions.map((expression_) =>
		ethers.utils.getAddress(expression_.account.id)
	);
	const accountsQuery = await supabaseClient
		.from('wallets')
		.select('address, profiles(username, avatar_url)')
		.in('address', _accounts);

	accountsQuery.data?.forEach((account_) => {
		_accountsData[account_.address.toLowerCase()] = {
			username: account_.profiles.username,
			avatar_url: account_.profiles.avatar_url
		};
	});

	// If the user session is active, get all the user's likes related to the recent expression obtained
	if (session) {
		const likesQuery = await supabaseClient
			.from('starred')
			.select(`id, address`)
			.eq('starred', 'expression')
			.eq('user_id', session.user?.id)
			.in(
				'address',
				recentExpressions.map((element) => element.id)
			);
		if (!likesQuery.error) {
			//
			likesQuery.data.forEach((element_) => {
				_userLikes[element_.address] = true;
			});
		}
	}

	// Get all the total likes of each expression
	const expressionLikesQuery = await supabaseClient
		.from('starred')
		.select(`id, address`)
		.eq('starred', 'expression')
		.in(
			'address',
			recentExpressions.map((element) => element.id)
		);
	if (!expressionLikesQuery.error) {
		//
		expressionLikesQuery.data.forEach((element_) => {
			if (!_expressionLikes[element_.address]) {
				_expressionLikes[element_.address] = 0;
			}
			_expressionLikes[element_.address] += 1;
		});
	}

	return {
		contract: contractQuery.data,
		deployers: deployerData,
		expressionSG: recentExpressions,
		accountsData: _accountsData,
		userLikes: _userLikes,
		expressionLikes: _expressionLikes
	};
};
