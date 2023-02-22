import { supabaseClient } from '$lib/supabaseClient';
import { ethers } from 'ethers';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';

import { createClient } from '@urql/core';
import { Subgraphs, QueryGetKnowContracts } from '$lib/utils';

import type { PageServerLoad } from './$types';
import type { UserLikes, ExpressionLikes, AccountData } from './types';
import { formatContract, parseMeta } from '$lib/utils/meta';

//  TODO: Support multichain - crosschain. At the moment, it's only supporting Mumbai.

/**
 * ChainID to filter. This could be use later to specify which subgraph use
 */
const chainId = 80001;

/**
 * Sort expression from recents to olders
 */
const sortExpressions = (a: any, b: any) => {
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

	//	Only mumbai at the moment
	const client = createClient({
		url: Subgraphs[0].endpoints.interpreters
	});

	const querySg = `
			query {
				interpreterInstances {
					id
				}
				expressionDeployers {
					id
				}
				contracts {
					id
					opmeta
				}
			}
		`;

	const { data: dataSg, error: errorSg } = await client.query(querySg, {}).toPromise();

	if (errorSg) throw error(404, 'Not found');

	const _contracts = formatContract(
		dataSg.contracts.filter((contract) => contract.opmeta !== null)
	);

	const slugData = _contracts.find((element_) => element_.slug == params.slug);

	const knowContractsQuery = await client
		.query(QueryGetKnowContracts, { knowAddresses: slugData?.knownAddress ?? [] })
		.toPromise();

	const meta = parseMeta(knowContractsQuery.data.contracts[0].opmeta);

	const contractQuery = await supabaseClient
		.from('contracts')
		.select('project ( * ), *')
		.eq('slug', params.slug)
		.single();

	// if (contractQuery.error) throw error(404, `Not found ${params.slug}`);

	if (knowContractsQuery.data) {
		recentExpressions = knowContractsQuery.data.contracts.map((ele) => ele.expressions).flat();
		recentExpressions.sort(sortExpressions);
	}

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

	const getAddresses = async (fetch_) => {
		const resp = await fetch_(`/api/get_interpreters`, {
			method: 'GET'
		});
		if (resp.ok) {
			const { interpreterAddresses } = await resp.json();
			return interpreterAddresses;
		}

		return [];
	};

	const interpreterDeployers = dataSg.expressionDeployers;

	slugData;

	return {
		contract: contractQuery?.data,
		slugData,
		meta,
		knowContracts: knowContractsQuery,
		interpreters: dataSg.interpreterInstances,
		interpreterDeployers,
		expressionSG: recentExpressions,
		accountsData: _accountsData,
		userLikes: _userLikes,
		expressionLikes: _expressionLikes
	};
};
