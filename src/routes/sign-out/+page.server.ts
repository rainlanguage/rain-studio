import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	cookies.delete('supabase-auth-token');
	cookies.delete('rain-studio-context');

	throw redirect(307, '/dashboard');
}
