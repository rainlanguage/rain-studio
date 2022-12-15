import { json, redirect } from '@sveltejs/kit';
import { SUPABASE_JWT } from '$env/static/private';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import jwt from 'jsonwebtoken';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { serialize } from 'cookie';

export async function verifyMessage(
	{ network, signature, message }: VerifyMessage,
	supabase_: TypedSupabaseClient
) {
	//
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request, cookies } = event;
	const { supabaseClient, session } = await getSupabase(event);

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


	cookies.set('supabase-auth-token', JSON.stringify(a), {
		path: '/',
		maxAge: 60 * 60
	});

	return json({ user, token });
}
