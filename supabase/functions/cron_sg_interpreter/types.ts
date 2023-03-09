// deno-lint-ignore-file no-explicit-any
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Database } from '../../../src/lib/types/generated-db-types.ts';

export type ContractDB = Database['public']['Tables']['contracts_new']['Row'] & {
	contract_addresses_new: Array<Database['public']['Tables']['contract_addresses_new']['Row']>;
};

export type ContractSG = {
	id: string;
	bytecodeHash: string;
	meta: string;
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
	chainId: number;
	contract: string;
	type: string;
};
