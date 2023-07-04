/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any

import { MetaDocumentSG } from '../types.ts';
import { deserializeContent } from './deserialization.ts';
import { hexToDecimalStringBigInt } from './index.ts';
import { decodedMetaOPMETA, MAGIC_NUMBERS } from './rainDocuments.ts';

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
