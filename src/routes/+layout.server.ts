import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { supabaseClient, session } = await getSupabase(event);

	let profile = null;
	let wallets_linked = [];

	if (session) {
		const { data } = await supabaseClient
			.from('wallet_users')
			.select(`*, wallets_linked(*)`)
			.eq('id', session.user.id)
			.single();

		if (data) {
			const { wallets_linked: wallets, ...user } = data;
			profile = user;
			wallets_linked = wallets.map((wallet_) => wallet_.address);
			_session = session;
		}
	}

	return {
		session,
		profile,
		wallets_linked
	};
};
