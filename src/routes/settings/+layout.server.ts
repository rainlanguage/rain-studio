import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
	const { supabaseClient, session } = await getSupabase(event);

	if (session) {
		let profile = null;

		if (session) {
			const { data } = await supabaseClient
				.from('wallet_users')
				.select(`*`)
				.eq('id', session.user.id)
				.single();
			profile = data;
		}

		return { session, profile };
	}

	throw redirect(307, '/sign-in');
}
