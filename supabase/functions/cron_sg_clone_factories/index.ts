import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

import { createDbClient, createSgClient } from './deps.ts';
import {
	getContracts,
	getSubgraph,
	filterNonAddedCloneFactories,
	filterUniqueIDs
} from './utils/index.ts';

import type { DataFactoryAddressUpload, DataFactoryUpload } from './types.ts';

serve(async (req) => {
	try {
		// Stablishing just one connection to the DB
		const supabaseClient = createDbClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			// This allow to get the Authorization from the header of the request (the bearer key)
			{ global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
		);

		// Obtaining the subgraph_url and his chain ID. This allow to add different
		// chains and subgraphs.
		const subgraphs = getSubgraph();

		let factoriesToAdd: DataFactoryUpload[] = [];
		let factoryAddressesToAdd: DataFactoryAddressUpload[] = [];

		for (let i = 0; i < subgraphs.length; i++) {
			const { subgraph_url, chain_id } = subgraphs[i];

			// Create connection the current subgraph (chainID)
			const subgraphClient = createSgClient({
				url: subgraph_url
			});

			// ** Filling the `contracts_new` and `contract_addresses_new` tables
			// Getting data and information about the contracts
			const { sgContracts, dBContracts } = await getContracts(supabaseClient, subgraphClient);

			// Filter non added contracts
			const filteredCloneFactories = filterNonAddedCloneFactories(
				sgContracts,
				dBContracts,
				chain_id
			);

			// Concat to the arrays, so we can use less insert queries
			factoriesToAdd = factoriesToAdd.concat(Object.values(filteredCloneFactories.factoriesToAdd));
			factoryAddressesToAdd = factoryAddressesToAdd.concat(
				Object.values(filteredCloneFactories.factoryAddressesToAdd)
			);
		}

		// Use reduce to avoid duplicated data on Cross Chain tables (like contracts
		// and deployers).The other items for entities like `contractAddresses` do
		// not need this filter since they are already have an unique ID because
		// use the ChainId for generate their ID. Ready the `filterUniqueIDs` for
		// similar explanation.
		factoriesToAdd = filterUniqueIDs(factoriesToAdd);

		// Handle and send insert to DB
		const nonChanged = 'No new data added';

		// Only send the query if the arrays are filled with data

		// - Factories
		const respContracts = factoriesToAdd.length
			? await supabaseClient.from('clone_factories').insert(factoriesToAdd)
			: nonChanged;

		const respContractAddresses = factoryAddressesToAdd.length
			? await supabaseClient.from('clone_factories_address').insert(factoryAddressesToAdd)
			: nonChanged;

		// Return a response with the fully information about any result and well formatted for readability
		return new Response(
			JSON.stringify(
				{
					responses: {
						respContracts,
						respContractAddresses
					}
				},
				null,
				2
			),
			{
				headers: { 'Content-Type': 'application/json' },
				status: 200
			}
		);
	} catch (error) {
		// return new Response(JSON.stringify({ error }), {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { 'Content-Type': 'application/json' },
			status: 400
		});
	}
});
