import { json, redirect } from '@sveltejs/kit';
import { SUPABASE_JWT } from '$env/static/private';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import jwt from 'jsonwebtoken';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';

/** @type {import('./$types').RequestHandler} */
export async function POST(event) {
	const { request, cookies } = event;
	const session = await getServerSession(event);
	// const { supabaseClient, session } = await getSupabase(event);

	console.log('Session');
	console.log(session);

	return json({ success: true });
}
