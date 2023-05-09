import { arrayify, isBytesLike, inflate } from '../deps.ts';
import { MetaContentV1SG } from '../types.ts';
import { textDecoder } from './textDecoder.ts';

/**
 * @public
 * From a given `content_` which is a MetaContent from the Interpreter Subgraph
 * deserialize the payload following his content
 *
 * @dev @todo
 * `NOTE:` Maybe need support more variations (?)
 */
export function deserializeContent(content_: MetaContentV1SG) {
	const { payload, contentType, contentEncoding } = content_;

	if (contentType === 'application/json') {
		if (!contentEncoding) {
			// Decode the bytes directly to JSON
			const _uint8Arr = arrayify(payload, { allowMissingPrefix: true });

			// Decoder use UTF-8 by default
			const decoded = textDecoder.decode(_uint8Arr);

			return JSON.parse(decoded);
		}
		//
		else if (contentEncoding === 'deflate') {
			// Inflate JSON
			return inflateJson(payload);
		}
	} else {
		// TODO: Support more content types
		return null;
	}
}

/**
 * @public
 * Inverse of `deflateJson`. Get a hex string  or Uint8Array and inflate
 * the JSON to obtain an string with the decoded data.
 *
 * @param bytes - Bytes to infalte to json
 */
export const inflateJson = (bytes: unknown) => {
	if (!isBytesLike(bytes)) throw new Error('invalid bytes');
	const _uint8Arr = arrayify(bytes, { allowMissingPrefix: true });

	const inflated = inflate(_uint8Arr);
	const decoded = textDecoder.decode(inflated);
	const parsed = JSON.parse(decoded);
	return parsed;
};
