/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any

import { ABI, ContractMeta, Metadata, MetaDocumentSG } from '../types.ts';
import { deserializeContent } from './deserialization.ts';
import { hexToDecimalStringBigInt } from './index.ts';
import { decodedMeta, decodedMetaOPMETA, MAGIC_NUMBERS } from './rainDocuments.ts';

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

	const solidityAbiJson = deserializeContent(_solidityAbiContent) as ABI | null;
	const metaContentJson = deserializeContent(_contractMetaContent) as ContractMeta | null;

	if (!solidityAbiJson || !metaContentJson) return null;

	return {
		abi: solidityAbiJson,
		contractMeta: metaContentJson
	};
}

/**
 * @public
 * Use the meta from the SG and get the Meta content required for the ExpressionDeployers
 */
export function manageDeployerMetaSg(
	meta_: MetaDocumentSG
): { opmetaDecoded: any; opmeta_bytes: string } | null {
	if (!meta_) return null;

	if (!meta_.content || meta_.content.length == 0) {
		if (!meta_.metaBytes) return null;

		return decodedMetaOPMETA(meta_.metaBytes);
	}

	const metaContent = meta_.content;

	const mnOpsMeta = hexToDecimalStringBigInt(MAGIC_NUMBERS.OpsMeta);

	const _opsMetaContent = metaContent.find((elem) => elem.magicNumber == mnOpsMeta);

	// If the Content was not found, the data and it wil be ignored
	if (!_opsMetaContent) return null;

	const opmetaDecoded = deserializeContent(_opsMetaContent);

	if (!opmetaDecoded) return null;

	return {
		opmetaDecoded,
		opmeta_bytes: _opsMetaContent.payload
	};
}

export function getClonableVersion(abi_: ABI): 'factory_v1' | 'factory_v2' | null {
	const initializeComponent = abi_.find((component_) => {
		const { type, name, inputs } = component_;

		if (type === 'function' && name === 'initialize') {
			if (inputs && inputs.length === 1 && inputs[0].type === 'bytes') {
				return true;
			}
		}
	});

	if (initializeComponent) {
		const { outputs, inputs } = initializeComponent;

		if (!outputs || (outputs && outputs.length === 0)) {
			// This is ICloneableV1. It's deprecated, but there are contract using it.
			// Examining all the inputs, since they should match this on ICloneableV1.
			if (inputs && inputs[0].name == 'data_' && inputs[0].internalType === 'bytes') {
				return 'factory_v1';
			}
		}
		// This is ICloneableV2. Examining the whole output, since they should match
		// the ICloneableV2.
		else if (
			outputs &&
			outputs.length === 1 &&
			outputs[0].type === 'bytes32' &&
			outputs[0].internalType === 'bytes32'
		) {
			return 'factory_v2';
		}
	}

	return null;
}
