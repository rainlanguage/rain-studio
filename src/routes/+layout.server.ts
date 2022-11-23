import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { supabaseClient } from '$lib/supabaseClient';

export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);
	let profile: any
	if (session) {
		const { data } = await supabaseClient
			.from('profiles')
			.select(`username, full_name, website, avatar_url`)
			.eq('id', session.user.id)
			.single();
		profile = data
		console.log(profile)
	}
	return {
		session, profile
	};
};
