import { json, redirect } from '@sveltejs/kit';
import { SUPABASE_JWT } from '$env/static/private';
import Moralis from 'moralis';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import jwt from 'jsonwebtoken';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { serialize } from 'cookie';

export async function verifyMessage(
	{ network, signature, message }: VerifyMessage,
	supabase_: TypedSupabaseClient
) {
	const result = await Moralis.Auth.verify({
		network,
		signature,
		message
	});

	const authData = result.toJSON();

	let { data: user, error } = await supabase_
		.from('users')
		.select('*')
		.eq('moralis_provider_id', authData.profileId)
		.single();

	// console.log(user);
	// console.log(error);

	if (!user) {
		const response = await supabase_
			.from('users')
			.insert({ moralis_provider_id: authData.profileId, metadata: authData })
			.single();
		user = response.data;
	}

	const time_expired = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

	console.log('user');
	console.log(user);

	// {
	// 	"aud": "authenticated",
	// 	"exp": 1670900356,
	// 	"sub": "06339e81-7623-42e8-9ff8-7bda9b581ca7",
	// 	"email": "victor.nanezj@gmail.com",
	// 	"phone": "",
	// 	"app_metadata": {
	// 		"provider": "email",
	// 		"providers": [
	// 			"email"
	// 		]
	// 	},
	// 	"user_metadata": {
	// 		"username": "nanezx"
	// 	},
	// 	"role": "authenticated",
	// 	"aal": "aal1",
	// 	"amr": [
	// 		{
	// 			"method": "password",
	// 			"timestamp": 1670896756
	// 		}
	// 	],
	// 	"session_id": "4762a9f9-b33d-43c0-99cd-6ca38a619577"
	// }

	const token = jwt.sign(
		{
			...user,
			aud: 'authenticated',
			role: 'authenticated',
			exp: time_expired
		},
		SUPABASE_JWT
	);
	// MINE
	// {
	// 	"id": "a3644bb0-70a4-4d74-8bce-6fc7dd8c86e5",
	// 	"created_at": "2022-12-12T23:49:42.024235+00:00",
	// 	"moralis_provider_id": "0xffd1ad0e1a06b083b796aafb9c13c49240a2b89c6a2739ee2d36c5047f6a8b60",
	// 	"metadata": {
	// 		"id": "vV38M0zPqp6QrV1oB",
	// 		"domain": "rain-studio.vercel.app",
	// 		"chainId": 80001,
	// 		"address": "0x4Ef88F266D03eC2a3e3e1beb1D77cB9c52c93003",
	// 		"statement": "Please sign this message to confirm your identity.",
	// 		"uri": "https://rain-studio.vercel.app",
	// 		"expirationTime": "2023-01-01T00:00:00.000Z",
	// 		"version": "1",
	// 		"nonce": "obMk6ccP9PEiZyVAd",
	// 		"profileId": "0xffd1ad0e1a06b083b796aafb9c13c49240a2b89c6a2739ee2d36c5047f6a8b60"
	// 	},
	// 	"aud": "authenticated",
	// 	"role": "authenticated",
	// 	"exp": 1671501645,
	// 	"iat": 1670896845
	// }

	// console.log(token);

	return { user, token, time_expired };
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request, cookies } = event;
	const { supabaseClient, session } = await getSupabase(event);

	console.log('Session');
	console.log(session);

	const { network, signature, message } = await request.json();

	const { token, user, time_expired } = await verifyMessage(
		{
			network,
			signature,
			message
		},
		supabaseClient
	);

	// console.log(token);

	const a = {
		access_token: token,
		token_type: 'bearer',
		expires_in: 3600,
		refresh_token: '',
		user: user,
		expires_at: time_expired
	};

	// cookies.set('supabase-auth-token', JSON.stringify(a));

	// cookies.set('supabase-auth-token', JSON.stringify(a), {
	// 	path: '/',
	// 	maxAge: 60 * 60
	// });

	cookies.set('supabase-auth-token', JSON.stringify(a), {
		path: '/',
		maxAge: 60 * 60
	});

	return json({ user, token });
}
