import { format } from 'prettier';
import { inflateSync } from 'zlib';

type SGContract = {
	id: string;
	opmeta: string;
};

type FormattedContract = {
	name: string;
	slug: string;
	description: string;
	knownAddress: string[];
};

export function parseMeta(bytes: string) {
	if (bytes.startsWith('0x')) bytes = bytes.slice(2);
	const _bytesArr = [];
	for (let i = 0; i < bytes.length; i += 2) {
		_bytesArr.push(Number('0x' + bytes.slice(i, i + 2)));
	}
	const _uint8Arr = Uint8Array.from(_bytesArr);

	const _meta = format(inflateSync(_uint8Arr).toString(), { parser: 'json' });

	return JSON.parse(_meta);
}

export function formatContract(contracts_: SGContract[]): FormattedContract[] {
	const _contracts: {
		[key: string]: FormattedContract;
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
