import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { supabaseClient, session } = await getSupabase(event);

	let profile = null;
	let wallets_linked = [];
	let organizations = [];

	if (session) {
		const { data: dataWallets } = await supabaseClient
			.from('wallet_users')
			.select(`*, wallets_linked(*)`)
			.eq('id', session.user.id)
			.single();

		if (dataWallets) {
			const { wallets_linked: wallets, ...user } = dataWallets;
			profile = user;
			wallets_linked = wallets.map((wallet_) => wallet_.address);
		}

		const { data: dataOrgs } = await supabaseClient
			.from('org_member')
			.select(`id, role, info_org: organizations(*)`)
			.eq('user_id', session.user.id);

		if (dataOrgs) {
			organizations = dataOrgs;
		}
	}

	return {
		session,
		profile,
		wallets_linked,
		organizations
	};
};
