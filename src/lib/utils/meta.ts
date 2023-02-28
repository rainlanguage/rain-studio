import { hexlify } from 'ethers/lib/utils';
import { format } from 'prettier';
import { inflateSync } from 'zlib';
import { decodeRainDocument, MAGIC_NUMBERS } from './metadataV1';

type SGContract = {
	id: string;
	opmeta: string;
	chainId: number;
};

type FormattedContract = {
	name: string;
	slug: string;
	description: string;
	knownAddresses: string[];
	chainId: number;
};

export function parseMeta(bytes: string, magicNumber: bigint) {
	const decoded = decodeRainDocument(bytes);

	// Find the correct element related to OPS_META_V1
	const metaMap = decoded.find((elem_) => elem_.get(1) === magicNumber);

	if (metaMap === undefined) {
		throw new Error(`No data found for magic number ${magicNumber}`);
	}

	const hexMeta = hexlify(metaMap.get(0));
	const _meta = inflateJson(hexMeta);
	return JSON.parse(_meta);
}

export function formatContract(contracts_: SGContract[]): FormattedContract[] {
	const _contracts: {
		[key: string]: FormattedContract;
	} = {};

	for (let i = 0; i < contracts_.length; i++) {
		const contract = contracts_[i];

		if (!contract.opmeta) continue;

		const meta = parseMeta(contract.opmeta, MAGIC_NUMBERS.CONTRACT_META_V1);

		if (_contracts[meta.alias]) {
			_contracts[meta.alias].knownAddresses.push(contract.id);
		} else {
			_contracts[meta.alias] = {
				name: meta.name,
				slug: meta.alias,
				description: meta.desc,
				knownAddresses: [contract.id],
				chainId: contract.chainId
			};
		}
	}
	return Object.values(_contracts);
}

/**
 * @public
 * `WIP:` Inverse of `deflateJson`. Get a hex string  or Uint8Array and inflate
 * the JSON to obtain an string with the decoded data.
 */
export const inflateJson = (bytes: string | Uint8Array) => {
	let _uint8Arr: Uint8Array;
	if (typeof bytes === 'string') {
		if (bytes.startsWith('0x')) bytes = bytes.slice(2);
		const _bytesArr = [];
		for (let i = 0; i < bytes.length; i += 2) {
			_bytesArr.push(Number('0x' + bytes.slice(i, i + 2)));
		}
		_uint8Arr = Uint8Array.from(_bytesArr);
	} else {
		_uint8Arr = bytes;
	}
	return format(inflateSync(_uint8Arr).toString(), { parser: 'json' });
};
