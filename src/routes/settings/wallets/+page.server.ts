import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { fail } from '@sveltejs/kit';
import { utils } from 'ethers';

// Types
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';

type FailureData = {
	status: number;
	message: string;
};
type ResponseData = {
	success: boolean;
	error?: FailureData;
};

/** @type {import('./$types').Actions} */
export const actions = {
	linkAddress: async (event) => {
		const { request, fetch } = event;
		const { supabaseClient, session } = await getSupabase(event);

		const data = await request.formData();
		const address = data.get('address');
		const signature = data.get('signature');

		const verifyResp = await verifySignature(address, signature, fetch);
		if (!verifyResp.success) {
			return verifyResp.error;
		}

		const linkResp = await linkAddress(address, session.user.id, supabaseClient);
		if (!linkResp.success) {
			return linkResp.error;
		}
	},
	unlinkAddress: async (event) => {
		const { request } = event;
		const { supabaseClient, session } = await getSupabase(event);

		const data = await request.formData();
		const address = data.get('address');

		const unlinkResp = await unlinkAddress(address, session.user.id, supabaseClient);
		if (!unlinkResp.success) {
			return unlinkResp.error;
		}
	}
};

async function verifySignature(address_: string, signature: string, fetch_): Promise<ResponseData> {
	const resp = await fetch_(`/api/auth/request_message`, {
		method: 'POST',
		body: JSON.stringify({
			address: address_
		})
	});

	if (!resp.ok) {
		return returnFailure(400, 'It was not possible to verify the signature, please try again');
	}

	const message = (await resp.json()).message;
	const signerAddress = utils.verifyMessage(message, signature);

	if (signerAddress !== address_) {
		// Unauthorized address
		return returnFailure(401, 'The signature does not match to this address');
	}

	return {
		success: true
	};
}

async function linkAddress(
	address_: string,
	userId_: string,
	supabase_: TypedSupabaseClient
): Promise<void | never> {
	const insertData = {
		address: address_,
		user_id: userId_
	};

	const { error } = await supabase_.from('wallets_linked').insert(insertData);
	if (error) {
		return returnFailure(400, 'The address could not be linked. Please, try again');
	}

	return {
		success: true
	};
}

async function unlinkAddress(
	address_: string,
	userId_: string,
	supabase_: TypedSupabaseClient
): Promise<void | never> {
	const { error } = await supabase_
		.from('wallets_linked')
		.delete()
		.eq('address', address_)
		.eq('user_id', userId_);

	if (error) {
		return returnFailure(400, error.message);
	}

	return {
		success: true
	};
}

/**
 * Function to return info about a "fail" and trigger a Failure on the action.
 */
function returnFailure(codeStatus_: number, errorMessage_: string): ResponseData {
	return {
		success: false,
		error: fail(codeStatus_, { message: errorMessage_ })
	};
}
