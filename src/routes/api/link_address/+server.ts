import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { json } from '@sveltejs/kit';
import { createMessage } from '$lib/utils';
import { utils } from 'ethers';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request } = event;
	const { supabaseClient, session } = await getSupabase(event);

	const { address, signedMessage } = await request.json();
	const userId = session.user.id;

	const { data, error: nonceError } = await supabaseClient.functions.invoke('get_nonce', {
		body: { address }
	});

	if (nonceError) {
		const message = `Something happened whe trying to generate the nonce id to the address ${address}. ERROR: ${nonceError.message}`;
		console.log(message);
		return json({ success: false, error: { message } });
	}

	// Check signed message
	const message = createMessage(address, data.id);
	const signerAddress = utils.verifyMessage(message, signedMessage);

	if (address !== signerAddress) {
		const message = `The address that signed the message does not match the address that the request is trying to link.`;
		console.log(message);
		return json({ success: false, error: { message } });
	}

	const insertData = {
		id: data.id,
		address,
		user_id: userId
	};
	const { error: insertError } = await supabaseClient.from('wallets').insert(insertData);

	if (insertError) {
		const message = `Something happened whe trying to linked the address ${address}. ERROR: ${insertError.message}`;
		console.log(message);
		return json({ success: false, error: { message } });
	}

	return json({ success: true });
}
