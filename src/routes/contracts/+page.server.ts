import { supabaseClient } from '$lib/supabaseClient';
import { Subgraphs } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { createClient } from '@urql/core';

import { format } from 'prettier';
import { inflateSync } from 'zlib';

type SGContract = {
	id: string;
	opmeta: string;
};

type FormatedContract = {
	name: string;
	slug: string;
	description: string;
	knownAddress: string[];
};

function parseMeta(bytes: string) {
	// let _uint8Arr: Uint8Array;

	if (bytes.startsWith('0x')) bytes = bytes.slice(2);
	const _bytesArr = [];
	for (let i = 0; i < bytes.length; i += 2) {
		_bytesArr.push(Number('0x' + bytes.slice(i, i + 2)));
	}
	const _uint8Arr = Uint8Array.from(_bytesArr);

	const _meta = format(inflateSync(_uint8Arr).toString(), { parser: 'json' });

	return JSON.parse(_meta);
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	let contracts: null | any[] = null;

	const query = await supabaseClient
		.from('contracts')
		.select('project ( name, logo_url ), metadata, abi, slug');

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

	if (query.error) throw error(404, 'Not found');
	if (errorSg) throw error(404, 'Not found');

	contracts = formatContract(dataSg.contracts);

	return { contracts: contracts };
}

function formatContract(contracts_: SGContract[]): FormatedContract[] {
	const _contracts: {
		[key: string]: FormatedContract;
	} = {};

	for (let i = 0; i < contracts_.length; i++) {
		const contract = contracts_[i];
		const meta = parseMeta(contract.opmeta);

		if (_contracts[meta.alias]) {
			_contracts[meta.alias].knownAddress.push(contract.id);
		} else {
			_contracts[meta.alias] = {
				name: meta.name,
				slug: meta.alias,
				description: meta.desc,
				knownAddress: [contract.id]
			};
		}
	}
	return Object.values(_contracts);
}
