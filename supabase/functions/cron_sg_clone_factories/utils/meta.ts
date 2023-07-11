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

export function hasCloneMethod(abi: ABI, contractMeta?: ContractMeta): boolean {
	if (contractMeta && contractMeta.name == 'CloneFactory') {
		return true;
	} else {
		let hasMethod = false;
		abi.forEach((component_) => {
			if (
				component_.name == 'clone' &&
				component_.type == 'function' &&
				component_.inputs &&
				component_.inputs.length == 2
			) {
				hasMethod = true;
				return;
			}
		});

		return hasMethod;
	}
}

/**
 * @public
 * Use the meta from the SG and get the Meta content required for the Contract
 */
export function manageContractMetaSg(
	meta_: MetaDocumentSG
): { abi: ABI; contractMeta?: ContractMeta } | null {
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

	// We need at least the ABI
	if (!_solidityAbiContent) return null;

	const solidityAbiJson = deserializeContent(_solidityAbiContent) as ABI | null;
	const metaContentJson = _contractMetaContent
		? (deserializeContent(_contractMetaContent) as ContractMeta | null)
		: undefined;

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

	return {
		opmetaDecoded,
		opmeta_bytes: _opsMetaContent.payload
	};
}

export function getClonaFactoryVersion(abi_: ABI): 'factory_v1' | 'factory_v2' | null {
	/**
	 * Here the code is trying to reduce the amount conditionals to meet to "identify",
	 * since anyway the ABIs coud be different or similar in many ways.
	 *
	 * - The component "constructor", his inputs should have one element. This input
	 * must be named `"config_"` to be a CloneFactoryV1. In case of CloneFactoryV2,
	 * the input must be named `"config"`.
	 * - The function clone could be used too with the above logic. The inputs should
	 * have 2 elements, and both inputs will have a suphix "_" on his name, like
	 * "implementation_" and "data_" to be a CloneFactoryV1. By other hand, without
	 * suphix, it is a CloneFactoryV2.
	 *
	 * This is only a remind of what can be used too, but by now only indentifying the
	 * error components is enough. This is because CloneFactoryV1 is deprecated, but
	 * future versions could again combine few components between them.
	 */

	// Giving priority to CloneFactoryV2 since have two components to check, that way
	// is less possible to get a component but then the ABI also could have another one.
	const v2Components = abi_.filter((component_) => {
		const { name, type, inputs } = component_;
		if (
			type === 'error' &&
			(name === 'InitializationFailed' || name === 'ZeroImplementationCodeSize') &&
			inputs &&
			inputs.length === 0
		) {
			return true;
		}
	});

	// Here, we assume that is a CloneFactoryV2 ONLY if have both components
	if (v2Components.length === 2) {
		return 'factory_v2';
	}

	const v1Component = abi_.find((component_) => {
		const { name, type, inputs } = component_;

		if (type === 'error' && name === 'ZeroImplementation' && inputs && inputs.length === 0) {
			return true;
		}
	});

	if (v1Component) {
		return 'factory_v1';
	}

	return null;
}
