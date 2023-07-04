export * from './database.ts';
export * from './deserialization.ts';
export * from './filters.ts';
export * from './meta.ts';
export * from './rainDocuments.ts';
export * from './subgraph.ts';
export * from './textDecoder.ts';
export * from './uuid.ts';

/**
 * @public
 * Take an hexadecimal string and convert it to a decimal string using BigInt
 */
export function hexToDecimalStringBigInt(hexString_: string): string {
	hexString_ = hexString_.toLowerCase();
	if (!hexString_.startsWith('0x')) hexString_ = '0x' + hexString_;

	const decimalString = BigInt(hexString_).toString(10);
	return decimalString;
}
