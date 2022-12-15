import { getSupabase } from '@supabase/auth-helpers-sveltekit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const { supabaseClient, session } = await getSupabase(event);

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
