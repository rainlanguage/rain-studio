import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

import { createDbClient, createSgClient } from './deps.ts';
import {
	getSubgraph,
	filterNonAddedContracts,
	getContracts,
	filterUniqueIDs
} from './utils/index.ts';

import type { DataAddressUpload, DataContractUpload } from './types.ts';

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

		// Array to be use to insert into the Database
		let contractsToAdd: DataContractUpload[] = [];
		let contractAddressesToAdd: DataAddressUpload[] = [];

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
			const filteredContracts = filterNonAddedContracts(sgContracts, dBContracts, chain_id);


			// Concat to the arrays, so we can use less insert queries
			contractsToAdd = contractsToAdd.concat(Object.values(filteredContracts.contractsToAdd));
			contractAddressesToAdd = contractAddressesToAdd.concat(
				Object.values(filteredContracts.addressesToAdd)
			);
		}

		// Use reduce to avoid duplicated data on Cross Chain tables on contracts.
		// The other items for entities like `contractAddresses` do not need this
		// filter since they are already have an unique ID because use the ChainId
		// for generate their ID. Read the `filterUniqueIDs` for similar explanation.
		contractsToAdd = filterUniqueIDs(contractsToAdd);

		// Handle and send insert to DB
		const nonChanged = 'No new data added';

		// Only send the query if the arrays are filled with data
		// - Contracts
		const respContracts = contractsToAdd.length
			? await supabaseClient.from('contracts_new').insert(contractsToAdd)
			: nonChanged;

		const respContractAddresses = contractAddressesToAdd.length
			? await supabaseClient.from('contract_addresses_new').insert(contractAddressesToAdd)
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
		return new Response(JSON.stringify({ error }), {
			headers: { 'Content-Type': 'application/json' },
			status: 400
		});
	}
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
