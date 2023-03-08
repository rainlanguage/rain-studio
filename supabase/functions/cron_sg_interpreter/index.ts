// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';

import { createClient } from 'https://esm.sh/@urql/core/dist/urql-core.js';

console.log('Hello from Functions!');

serve(async (req) => {
	try {
		// const supabaseClient = createClient(
		// 	Deno.env.get('SUPABASE_URL') ?? '',
		// 	Deno.env.get('SUPABASE_ANON_KEY') ?? '',
		// 	{ global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
		// );
		// const resp = await supabaseClient.from('contracts').insert({ slug: slug_ }).select('id');

		const { subgraph_url } = await req.json();

		const client = createClient({
			url: subgraph_url
		});

		const query = `
		  {
		      contracts {
		          id
		      }
		  }
		`;

		// const resp = await client.query(query, {}).toPromise();

		const response = await client.query(query, {}).toPromise();

		return new Response(JSON.stringify({ resp: response }, null, 2), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error }), {
			headers: { 'Content-Type': 'application/json' },
			status: 400
		});
	}

	// const { name } = await req.json();
	// const data = {
	// 	message: `Hello ${name}!`
	// };

	// return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
