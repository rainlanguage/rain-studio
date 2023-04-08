// deno-lint-ignore-file no-explicit-any
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Database } from '../../../src/lib/types/generated-db-types.ts';

export type ContractDB = Database['public']['Tables']['contracts_new']['Row'] & {
	contract_addresses_new: Array<Database['public']['Tables']['contract_addresses_new']['Row']>;
};

export type DeployerDB = Database['public']['Tables']['deployers']['Row'] & {
	deployers_addresses: Array<Database['public']['Tables']['deployers_addresses']['Row']>;
};

export type RainterpreterDB = Database['public']['Tables']['rainterpreters']['Row'] & {
	rainterpreter_addresses: Array<Database['public']['Tables']['rainterpreter_addresses']['Row']>;
};

export type Rainterpreter_storesDB = Database['public']['Tables']['rainterpreter_stores']['Row'] & {
	rainterpreter_store_addresses: Array<
		Database['public']['Tables']['rainterpreter_store_addresses']['Row']
	>;
};

export type ContractSG = {
	id: string;
	bytecodeHash: string;
	meta: MetaDocumentSG;
};

export type MetaDocumentSG = {
	metaBytes: string;
	content: Array<MetaContentV1SG>;
};

export type MetaContentV1SG = {
	payload: string;
	magicNumber: string;
	contentType: string;
	contentEncoding: string;
	contentLanguage: string;
};

export type ExpressionDeployerSG = {
	id: string;
	bytecodeHash: string;
	meta: MetaDocumentSG;
};

export type InterpreterSG = {
	/**
	 * The ID is the bytecode hash of all the Interpreters Instances
	 */
	id: string;
	/**
	 * The instances are each interpreter address that have the same bytecode
	 */
	instances: Array<{
		/**
		 * Address of the instance
		 */
		id: string;
	}>;
};

export type RainterpreterStoreSG = {
	/**
	 * The ID is the bytecode hash of all the RainterpreterStore Instances
	 */
	id: string;
	/**
	 * The instances are each store address that have the same bytecode
	 */
	instances: Array<{
		/**
		 * Address of the instance
		 */
		id: string;
	}>;
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

export type DataDeployerUpload = {
	id: string;
	bytecode_hash: string;
	opmeta: any;
	opmeta_bytes: string;
};

export type DataDeployerAddressUpload = {
	id: string;
	deployer: string;
	address: string;
	chainId: number;
};

export type DataRainterpreterUpload = {
	id: string;
	bytecode_hash: string;
};

export type DataRainterpreterAddressUpload = {
	id: string;
	rainterpreter: string;
	address: string;
	chainId: number;
};

export type DataRainterpreterStoreUpload = {
	id: string;
	bytecode_hash: string;
};

export type DataRainterpreterStoreAddressUpload = {
	id: string;
	rainterpreter_store: string;
	address: string;
	chainId: number;
};
