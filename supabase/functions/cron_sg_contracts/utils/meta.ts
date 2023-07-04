/* eslint-disable @typescript-eslint/no-explicit-any */

import { ABI, ContractMeta, Metadata, MetaDocumentSG } from '../types.ts';
import { deserializeContent } from './deserialization.ts';
import { hexToDecimalStringBigInt } from './index.ts';
import { decodedMeta, MAGIC_NUMBERS } from './rainDocuments.ts';

/**
 * @public
 * Use ContractMeta information and generate rich and well-formed Metadata
 */
export function buildMetadataFromMeta(contractMeta_: ContractMeta): Metadata {
	return {
		name: contractMeta_.name,
		source: contractMeta_.source,
		description: contractMeta_.desc,
		version: {
			major: 0,
			minor: 1
		},
		inputs: contractMeta_.methods[0].inputs,
		expressions: contractMeta_.methods[0].expressions
	};
}

/**
 * @public
 * Use the meta from the SG and get the Meta content required for the Contract
 */
export function manageContractMetaSg(
	meta_: MetaDocumentSG
): { abi: ABI; contractMeta: ContractMeta } | null {
	if (!meta_) return null;

	if (!meta_.content || meta_.content.length == 0) {
		if (!meta_.metaBytes) return null;

		return decodedMeta(meta_.metaBytes);
	}

	const metaContent = meta_.content;

	const mnABI = hexToDecimalStringBigInt(MAGIC_NUMBERS.SolidityABI);
	const mnContractMeta = hexToDecimalStringBigInt(MAGIC_NUMBERS.ContractMeta);

	const _solidityAbiContent = metaContent.find((elem) => elem.magicNumber == mnABI);
	const _contractMetaContent = metaContent.find((elem) => elem.magicNumber == mnContractMeta);

	// If some Content was not found, the data and it wil be ignored
	if (!_solidityAbiContent || !_contractMetaContent) return null;

	const solidityAbiJson = deserializeContent(_solidityAbiContent);
	const metaContentJson = deserializeContent(_contractMetaContent);

	return {
		abi: solidityAbiJson,
		contractMeta: metaContentJson
	};
}
