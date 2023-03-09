import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

import { createDbClient, createSgClient } from './deps.ts';
import { DataAddressUpload, DataContractUpload } from './types.ts';

import {
	getDBContracts,
	getSGContracts,
	getSubgraph,
	filterNonAddedContracts
} from './utils/index.ts';

serve(async (req) => {
	try {
		// Stablishing just one connection to the DB
		const supabaseClient = createDbClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			{ global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
		);

		// Obtaining the subgraph_url and his chain ID
		// This could be changed later to iterate over an array of suybgraphs and chains
		const subgraphs = getSubgraph();

		// Array to be use to insert into the Database
		let contractsToAdd: DataContractUpload[] = [];
		let addressesToAdd: DataAddressUpload[] = [];

		for (let i = 0; i < subgraphs.length; i++) {
			const { subgraph_url, chainId } = subgraphs[i];

			// Create connection the current subgraph (chainID)
			const subgraphClient = createSgClient({
				url: subgraph_url
			});

			const contracts = await getSGContracts(subgraphClient);

			const DBContracts = await getDBContracts(supabaseClient);

			// Filter non added contracts
			const filteredContracts = filterNonAddedContracts(contracts, DBContracts, chainId);

			// Concat to the arrays, so we can use less insert queries
			contractsToAdd = contractsToAdd.concat(Object.values(filteredContracts.contractsToAdd));
			addressesToAdd = addressesToAdd.concat(Object.values(filteredContracts.addressesToAdd));
		}

		let respContracts = 'No new contracts added';
		let respAddresses = 'No new addresses added';

		// Only send the query if the arrays are filled with data
		if (contractsToAdd.length)
			respContracts = await supabaseClient.from('contracts_new').insert(contractsToAdd);

		if (addressesToAdd.length)
			respAddresses = await supabaseClient.from('contract_addresses_new').insert(addressesToAdd);

		// Return a response with the fully information about any result and well formatted for readability
		return new Response(
			JSON.stringify(
				{
					responses: {
						contracts: respContracts,
						addresses: respAddresses
					},
					addresses: addressesToAdd
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
