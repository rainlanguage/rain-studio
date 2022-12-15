import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { generateUsername } from 'unique-username-generator';
import { SUPABASE_JWT } from '$env/static/private';
import { redirect, error } from '@sveltejs/kit';
import { utils } from 'ethers';
import jwt from 'jsonwebtoken';

import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const session = await getServerSession(event);
	if (session) {
		throw redirect(307, '/dashboard');
	}
	return { session };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		const { cookies, request, fetch } = event;
		const { supabaseClient } = await getSupabase(event);

		const data = await request.formData();
		const signature = data.get('signature');
		const address = data.get('address');

		await verifySignature(address, signature, fetch);
		const { newCookie } = await sign(address, supabaseClient);

		cookies.set('supabase-auth-token', JSON.stringify(newCookie), {
			path: '/',
			maxAge: newCookie.expires_at
		});

		return { _token: newCookie.access_token };
	}
};

async function verifySignature(address_: string, signature: string, fetch_): Promise<void | never> {
	const resp = await fetch_(`/api/auth/request_message`, {
		method: 'POST',
		body: JSON.stringify({
			address: address_
		})
	});

	if (!resp.ok) {
		throw error(400, {
			message: 'Failed to sign in.'
		});
	}

	const message = (await resp.json()).message;
	const signerAddress = utils.verifyMessage(message, signature);

	if (signerAddress !== address_) {
		// Unauthorized address
		throw error(401, {
			message: 'Wrong sign from the address.'
		});
	}
}

async function sign(address_: string, supabase_: TypedSupabaseClient) {
	let user;

	const resp = await supabase_
		.from('wallets_linked')
		.select('id, user:user_id(*)')
		.eq('address', address_)
		.single();

	user = resp.data?.user;

	if (resp.error) {
		// Since it's sign in - Create a new user with this wallet and a random Username
		const username_ = generateUsername('', 6);
		const respNewUser = await supabase_.rpc('new_user_from_address', {
			address_,
			username_
		});

		if (respNewUser.error) {
			throw error(400, {
				message: 'Failed to sign up a new user.'
			});
		}

		const resp = await supabase_
			.from('wallets_linked')
			.select('id, user:user_id(*)')
			.eq('address', address_)
			.single();

		user = resp.data?.user;
	}

	if (!user) {
		throw error(400, {
			message: 'Failed to sign in.'
		});
	}

	const expires_in = 60 * 60; // 3600sec
	const time_expired = Math.floor(Date.now() / 1000) + expires_in;

	const token = jwt.sign(
		{
			...user,
			aud: 'authenticated',
			role: 'authenticated',
			exp: time_expired
		},
		SUPABASE_JWT
	);

	const _cookie = {
		access_token: token,
		token_type: 'bearer',
		expires_in: expires_in,
		refresh_token: '',
		user: user,
		expires_at: time_expired
	};

	return { newCookie: _cookie };
}
