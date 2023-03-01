import { supabaseClient } from '$lib/supabaseClient';
import { QueryGetKnownContracts, Subgraphs } from '$lib/utils';
import { formatContract, parseMeta } from '$lib/utils/meta';
import { MAGIC_NUMBERS } from '$lib/utils/metadataV1';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import { createClient } from '@urql/core';
import { ethers } from 'ethers';
import type { PageServerLoad } from './$types';
import type { AccountData, ExpressionLikes, UserLikes } from './types';

let chainId: number;

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

	//	Only mumbai at the moment
	const mumbaiClient = createClient({
		url: Subgraphs[0].endpoints.interpreters
	});

	chainId = Subgraphs[0].chain;

	const querySg = `
		query {
			interpreterInstances {
				id
			}
			expressionDeployers {
				id
				meta
			}
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

	const _contracts = formatContract(dataSg.contracts);

	const slugData = _contracts.find((element_) => element_.slug == params.slug);

	const knownContractsQuery = await mumbaiClient
		.query(QueryGetKnownContracts, { knowAddresses: slugData?.knownAddresses ?? [] })
		.toPromise();

	const meta = parseMeta(
		knownContractsQuery.data.contracts[0].meta,
		MAGIC_NUMBERS.CONTRACT_META_V1
	);

	const contractQuery = await supabaseClient
		.from('contracts')
		.select('project ( * ), *')
		.eq('slug', params.slug)
		.single();

	// if (contractQuery.error) throw error(404, `Not found ${params.slug}`);

	if (knownContractsQuery.data) {
		recentExpressions = knownContractsQuery.data.contracts.map((ele) => ele.expressions).flat();
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

	return {
		contract: contractQuery?.data,
		slugData,
		meta,
		knownContracts: knownContractsQuery,
		interpreters: dataSg.interpreterInstances,
		expressionDeployers: dataSg.expressionDeployers,
		expressionSG: recentExpressions,
		accountsData: _accountsData,
		userLikes: _userLikes,
		expressionLikes: _expressionLikes,
		chainId
	};
};
