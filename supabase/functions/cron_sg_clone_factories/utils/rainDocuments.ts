/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any

import { hexlify, cbor } from '../deps.ts';
import { ABI, ContractMeta } from '../types.ts';
import { inflateJson } from './index.ts';

/**
 * @public
 * Magic numbers used to identify Rain documents as an hex string
 *
 * See more abour Magic numbers:
 * https://github.com/rainprotocol/metadata-spec/blob/main/README.md
 */
export const MAGIC_NUMBERS = {
	/**
	 * Prefixes every rain meta document. Rain Meta Document magic number as hex string.
	 */
	RainMetaDocument: hexlify(BigInt(0xff0a89c674ee7874n)),
	/**
	 * Contract meta v1. Contract Meta V1 magic number as hex string.
	 */
	ContractMeta: hexlify(BigInt(0xffc21bbf86cc199bn)),
	/**
	 * Solidity ABIv2. Solidiy ABI V2 magic number as hex string.
	 */
	SolidityABI: hexlify(BigInt(0xffe5ffb4a3ff2cden)),
	/**
	 * Ops meta v1. Ops Meta V1 magic number as hex string
	 */
	OpsMeta: hexlify(BigInt(0xffe5282f43e495b4n))
};

/**
 * @public
 * Use a decoded array of Maps from CBOR and return an specific item that met the
 * `compareValue_` in the magic number key (1).
 *
 * @param decodedMaps_ The array obtained from CBOR decode
 * @param magicNumber_ Magic number to found an specific item
 */
export function findDocInDecodedArray(
	decodedMaps_: unknown[],
	magicNumber_: string
): Map<number, any> | undefined {
	const magicNumberKey = 1;

	if (decodedMaps_.every((map_) => map_ instanceof Map)) {
		const decodedMaps = decodedMaps_ as Array<Map<number, any>>;
		return decodedMaps.find((elem_) => hexlify(elem_.get(magicNumberKey)) == magicNumber_);
	} else {
		// If a value is not a map, means that does not follow the Rain Meta Document design.
		// See: https://github.com/rainprotocol/metadata-spec/blob/main/README.md#header-name-aliases-cbor-map-keys
		throw new Error('A value in the decoded value is not a map');
	}
}

/**
 * @public
 * Get an CBOR sequence and decode it
 * @param meta_ Hex string CBOR sequence to decode
 */
export function decodedMeta(meta_: string): { abi: ABI; contractMeta: ContractMeta } | null {
	// If does not have the magic number, it is not proper
	if (!meta_.startsWith(MAGIC_NUMBERS.RainMetaDocument)) return null;

	// Remove the RainMetaDocument magic number
	const meta = meta_.replace(MAGIC_NUMBERS.RainMetaDocument, '');

	// Decoded the CBOR sequence
	const dataDecoded = cbor.decodeAllSync(meta);

	// Find the ABI Map
	const solidityAbiMap = findDocInDecodedArray(dataDecoded, MAGIC_NUMBERS.SolidityABI);
	const contractMetaMap = findDocInDecodedArray(dataDecoded, MAGIC_NUMBERS.ContractMeta);

	// If some Map was not found, the data and it wil be ignored
	if (!solidityAbiMap || !contractMetaMap) return null;

	const decodedAbi = decodedMap(solidityAbiMap) as ABI | null;
	const decodedContractMeta = decodedMap(contractMetaMap) as ContractMeta | null;

	if (!decodedAbi || !decodedContractMeta) return null;

	return {
		abi: decodedAbi,
		contractMeta: decodedContractMeta
	};
}

/**
 * @public
 * Get an CBOR sequence that have opmeta and decode it
 * @param meta_ Hex string CBOR sequence to decode
 */
export function decodedMetaOPMETA(
	meta_: string
): { opmetaDecoded: any; opmeta_bytes: string } | null {
	// If does not have the magic number, it is not proper
	if (!meta_.startsWith(MAGIC_NUMBERS.RainMetaDocument)) return null;

	// Remove the RainMetaDocument magic number
	const meta = meta_.replace(MAGIC_NUMBERS.RainMetaDocument, '');

	// Decoded the CBOR sequence
	const dataDecoded = cbor.decodeAllSync(meta);

	// Find the ABI Map
	const opsMetaMap = findDocInDecodedArray(dataDecoded, MAGIC_NUMBERS.OpsMeta);

	// If could not find the opmetaMap, return null
	if (!opsMetaMap) return null;

	// Obtain the the payload from key 0 and use `hexlify` to get the hex string.
	// CBOR-js parse the bytes as a ArrayByteLikes (Uint8Array)
	const opmeta_bytes = hexlify(opsMetaMap.get(0));

	// Decoded the map info into a object (from the deflated JSON)
	const opmetaDecoded = decodedMap(opsMetaMap);

	return { opmetaDecoded, opmeta_bytes };
}

/**
 * @public
 * From a possible given Map instace try to decoded using the Rain Document design
 * @param map_
 * @returns
 */
function decodedMap(map_: Map<number, any>) {
	const payloadBytes = hexlify(map_.get(0));
	const contentType = map_.get(2) as string;
	const contentEncoding = map_.get(3) as string;

	// TODO: Support more content header options
	if (contentType === 'application/json' && contentEncoding === 'deflate') {
		return inflateJson(payloadBytes);
	}

	return null;
}
