// deno-lint-ignore-file no-explicit-any
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Database } from '../../../src/lib/types/generated-db-types.ts';
import type { Client } from 'https://esm.sh/v111/@urql/core@3.2.0';
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0-rc.12';

export { Client as SubgraphClient, SupabaseClient };

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
	 * Contract meta bytes of this contract
	 */
	contractMeta: string;
	/**
	 * Hash of  the contract meta bytes of this contract
	 */
	contractMetaHash: string;
	/**
	 * The ExpressionDeployer used on the Constructor of the contract
	 */
	initialDeployer: Instance;
	/**
	 * MetaV1 document decoded
	 */
	meta: MetaDocumentSG;
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

/**
 * @type
 * The expression deployer format that comes from the SG query
 */
export type ExpressionDeployerSG = {
	/**
	 * ID of the entity from the subgraph
	 */
	id: string;
	/**
	 * Hash of the bytecode of the this contract
	 */
	bytecodeHash: string;
	/**
	 * Opmeta of this ExpressionDeployer
	 */
	opmeta: string;
	/**
	 * Hash of the opmeta of this ExpressionDeployer
	 */
	opmetaHash: string;
	/**
	 * Rainterpreter contract instance
	 */
	interpreter: Instance;
	/**
	 * Store interpreter instance
	 */
	store: Instance;
	/**
	 * MetaV1 document decoded
	 */
	meta: MetaDocumentSG;
};

/**
 * @type
 * The rainterpreter format that comes from the SG query
 */
export type InterpreterSG = {
	/**
	 * The ID is the bytecode hash of all the Interpreters Instances
	 */
	id: string;
	/**
	 * The instances are each interpreter address that have the same bytecode
	 */
	instances: Array<Instance>;
};

/**
 * @type
 * The rainterpreterStore format that comes from the SG query
 */
export type RainterpreterStoreSG = {
	/**
	 * The ID is the bytecode hash of all the RainterpreterStore Instances
	 */
	id: string;
	/**
	 * The instances are each store address that have the same bytecode
	 */
	instances: Array<Instance>;
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
	meta_bytes: string;
	contract_meta_hash: string;
};

export type DataAddressUpload = {
	id: string;
	address: string;
	chain_id: number;
	contract: string;
	type: string;
	initial_deployer: string;
};

export type DataDeployerUpload = {
	id: string;
	bytecode_hash: string;
	opmeta: any;
	opmeta_bytes: string;
	opmeta_hash: string;
};

export type DataDeployerAddressUpload = {
	id: string;
	deployer: string;
	address: string;
	chainId: number;
	interpreter_address: string;
	store_address: string;
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

/**
 * A subgraph entity instances. Generally must refered to a Store, Rainterprer
 * or ExpressionDeployer instances, which means that the ID is the address of
 * that instance.
 */
type Instance = {
	/** Address of the instance */
	id: string;
};
