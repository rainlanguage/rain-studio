import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { v5 as uuidv5 } from 'https://esm.sh/uuid@9.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0-rc.12';

const namespace = '0d91cfc8-9be0-4458-8f05-5bd5a5bc2fbb';

serve(async (req) => {
	try {
		const supabaseClient = createClient(
			Deno.env.get('SUPABASE_URL') ?? '',
			Deno.env.get('SUPABASE_ANON_KEY') ?? ''
		);

		const { address } = await req.json();
		if (!address) {
			throw new Error('An address is necessary');
		}

		const id = uuidv5(address, namespace);

		const { data } = await supabaseClient.from('wallets').select('*').eq(`id`, id).single();

		if (data) {
			throw new Error('Address already linked');
		}

		return new Response(JSON.stringify({ id }), {
			headers: { 'Content-Type': 'application/json' },
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { 'Content-Type': 'application/json' },
			status: 400
		});
	}
});
