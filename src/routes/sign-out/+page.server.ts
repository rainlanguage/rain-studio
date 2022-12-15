import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	cookies.delete('supabase-auth-token');

	throw redirect(307, '/dashboard');
}
