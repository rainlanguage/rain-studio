import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request } = event;
	const { supabaseClient } = await getSupabase(event);

	const { address } = await request.json();

	const { data, error } = await supabaseClient.functions.invoke('get_nonce', {
		body: { address }
	});

	if (error) {
		const message = `Something happened whe trying to generate the nonce id to the address ${address}. ERROR: ${error.message}`;
		return json({ success: false, error: { message } });
	}

	return json({ success: true, id: data.id });
}
