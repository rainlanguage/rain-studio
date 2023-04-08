import type { SupabaseClient, SubgraphClient } from '../types.ts';
import { getSGContracts } from './subgraph.ts';
import { getDBContracts } from './database.ts';

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
 * Use a given supbaseClient and a subgraphClinet to make the required queries to
 * get and filter the contracts (InterpreterCallers).
 */
export async function getContracts(
	supabaseClient_: SupabaseClient,
	subgraphClient_: SubgraphClient
) {
	// Querying the contracts from supabase
	const dBContracts = await getDBContracts(supabaseClient_);

	// Querying the contracts from the subgraph endpoint passed
	const sgContracts = await getSGContracts(subgraphClient_);

	return {
		dBContracts,
		sgContracts
	};
}

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
