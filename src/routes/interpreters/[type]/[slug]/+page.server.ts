import { error as errorKit } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabaseClient } from '$lib/supabaseClient';

const interpreterTypes = ['deployer', 'rainterpreter', 'store'];

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
	const { params } = event;

	const { type, slug } = params;

	// It is not a valid interpreter type, so return throw error
	if (!interpreterTypes.includes(type.toLowerCase()))
		throw errorKit(404, 'Interpreter type not found');

	let query;

	// Just these three could happen because the `includes` checker above.
	if (type.toLowerCase() == 'deployer') {
		// deployer table
		query = supabaseClient.from('deployers').select('*, addresses: deployers_addresses(*)');
	} else if (type.toLowerCase() == 'rainterpreter') {
		// rainiterpreter table
		query = supabaseClient
			.from('rainterpreters')
			.select('*, addresses: rainterpreter_addresses(*)');
	} else {
		// store table
		query = supabaseClient
			.from('rainterpreter_stores')
			.select('*, addresses: rainterpreter_store_addresses(*)');
	}

	query = query.eq('bytecode_hash', slug).single();

	const { data, error } = await query;

	if (error) throw errorKit(404, 'Interpreter not found');

	// TODO: Get based on the params.type and the params.slug
	return { interpreter: data };
};
