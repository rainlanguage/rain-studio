import type { Database } from '$lib/types/generated-db-types';
import type { ContractMetadata } from 'rain-metadata/type-definitions/contract';
import type { InterpreterMetadata } from 'rain-metadata/type-definitions/interpreter';
import type { Abi } from 'abitype';

export type ExpressionRow = Database['public']['Tables']['draft_expressions_w']['Row'];
export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ContractRow = Database['public']['Tables']['contracts']['Row'];
export type ProfileRow = Database['public']['Tables']['wallet_users']['Row'];
export type InterpreterRow = Database['public']['Tables']['interpreters']['Row'];
export type ContractAddressRow = Database['public']['Tables']['contract_addresses_new']['Row'];
export type DeployerAddressesRow = Database['public']['Tables']['deployers_addresses']['Row']
export type ExpressionInsert = Database['public']['Tables']['draft_expressions_w']['Insert'];

export type ContractRowFull = Nest<
	Nest<Nest<ContractRow, 'project', ProjectRow>, 'metadata', ContractMetadata>,
	'abi',
	{ abi: Abi }
>;
export type ExpressionRowFull = Nest<
	Nest<
		Nest<Nest<ExpressionRow, 'contract', ContractRowFull | null>, 'user_id', ProfileRow>,
		'interpreter',
		InterpreterRowFull
	>,
	'saved_context',
	SavedContext
>;
export type InterpreterRowFull = Nest<InterpreterRow, 'metadata', InterpreterMetadata>;
//ExpressionRow & { contract: ContractRowFull, user_id: ProfileRow, interpreter: InterpreterRow }

/* type for saved context created by IDE.svelte */
type SavedContext = {
	mockContext: any;
	signedContext: any;
};

/**
 * Change the type of Keys of T from NewType
 */
export type Nest<
	T extends object, // original type
	Keys extends keyof T, // the keys to change, as a union type
	NewType // include the keys to override in a new type
> = {
		// Loop to every key. We gonna check if the key
		// is assignable to Keys. If yes, change the type.
		// Else, retain the type.
		[key in keyof T]: key extends Keys ? NewType : T[key];
	};
