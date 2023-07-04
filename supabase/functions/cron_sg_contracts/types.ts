// deno-lint-ignore-file no-explicit-any
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Database } from '../../../src/lib/types/generated-db-types.ts';
import type { Client } from 'https://esm.sh/v111/@urql/core@3.2.0';
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0-rc.12';

export { Client as SubgraphClient, SupabaseClient };

export type ContractDB = Database['public']['Tables']['contracts_new']['Row'] & {
	contract_addresses_new: Array<Database['public']['Tables']['contract_addresses_new']['Row']>;
};

/**
 * @type
 * The contract format that comes from the SG query
 */
export type ContractSG = {
	/**
	 * ID of the entity from the subgraph
	 */
	id: string;
	/**
	 * Hash of the bytcode of the this contract
	 */
	bytecodeHash: string;
	/**
	 * MetaV1 document decoded
	 */
	meta: MetaDocumentSG;
	/**
	 * Type of the contract. It could be 'proxy' or 'contract'
	 */
	type: string;
	/**
	 * Optional: Implementation information
	 */
	implementation: {
		id: string;
		bytecodeHash: string;
	} | null;
};

/**
 * @type
 * The meta document format that comes from the SG query
 */
export type MetaDocumentSG = {
	/**
	 * Raw meta bytes emited by the contract
	 */
	metaBytes: string;
	/**
	 * Array of the meta content decoded from the Meta emited by the contract
	 */
	content: Array<MetaContentV1SG>;
};

/**
 * @type
 * The meta content V1 format that comes from the SG query
 */
export type MetaContentV1SG = {
	/**
	 * Payload bytes of this part of the RainDocument
	 */
	payload: string;
	/**
	 * MagicNumber to identify and filter each enty of the RainDocument
	 */
	magicNumber: string;
	/**
	 * The content type of the payload
	 */
	contentType: string;
	/**
	 * The content encoding that is using the payload
	 */
	contentEncoding: string;
	/**
	 * The content language that is using the payload
	 */
	contentLanguage: string;
};

export type ABI = any[];

/**
 * Contract Meta JSON from the Meta
 */
export type ContractMeta = {
	name: string;
	source: string;
	desc: string;
	alias: string;
	methods: Array<{
		name: string;
		desc: string;
		inputs: any[];
		expressions: any[];
	}>;
};

/**
 * Metadata format to be stored in the Database
 */
export type Metadata = {
	name: string;
	source: string;
	description: string;
	version: {
		major: number;
		minor: number;
	};
	inputs: any[];
	expressions: any[];
};

export type DataContractUpload = {
	id: string;
	abi: any;
	contract_meta: any;
	metadata: any;
	slug: string;
};

export type DataAddressUpload = {
	id: string;
	address: string;
	chain_id: number;
	contract: string;
	type: string;
	implementation?: string;
};
