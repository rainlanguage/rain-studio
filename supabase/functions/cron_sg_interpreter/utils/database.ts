import type {
	SupabaseClient,
	DeployerDB,
	RainterpreterDB,
	Rainterpreter_storesDB
} from '../types.ts';

/**
 * @public
 * Use a given supabaseCLient to query to the Database and get all the Interpreter
 * relate information like Rainterpreters, Stores and Deployers.
 */
export async function getDBInterpretersData(supabaseClient_: SupabaseClient) {
	// Getting the `deployers` from supabase
	const respDeployer = await supabaseClient_.from('deployers').select('*, deployers_addresses(*)');
	if (respDeployer.error)
		throw new Error(`Cannot query the deployers from DB:  ${respDeployer.error}`);

	// Getting the `rainterpreters` from supabase
	const respRainterpreters = await supabaseClient_
		.from('rainterpreters')
		.select('*, rainterpreter_addresses(*)');
	if (respRainterpreters.error)
		throw new Error(`Cannot query the rainterpreters from DB:  ${respRainterpreters.error}`);

	// Getting the `rainterpreter_stores` from supabase
	const respStores = await supabaseClient_
		.from('rainterpreter_stores')
		.select('*, rainterpreter_store_addresses(*)');
	if (respStores.error)
		throw new Error(`Cannot query the rainterpreter_stores from DB:  ${respStores.error}`);

	const deployersDB = respDeployer.data as Array<DeployerDB>;
	const rainterpretersDB = respRainterpreters.data as Array<RainterpreterDB>;
	const rainterpreter_storesDB = respStores.data as Array<Rainterpreter_storesDB>;

	return {
		deployersDB,
		rainterpretersDB,
		rainterpreter_storesDB
	};
}
