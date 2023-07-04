import type { SupabaseClient, ContractDB } from '../types.ts';

/**
 * @public
 * Use a given supabaseCLient to query to the Database and get all the Contracts
 * from `contracts_new` and the related information like contract addresses from
 * `contract_addresses_new`
 */
export async function getDBContracts(supabaseClient_: SupabaseClient): Promise<ContractDB[]> {
	const resp = await supabaseClient_.from('contracts_new').select('*, contract_addresses_new(*)');
	if (resp.error) throw new Error(`Cannot query from DB:  ${resp.error}`);

	return resp.data;
}
