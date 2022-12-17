import { getDeployedExpressionByAddress } from '$lib/expressions/expressions';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	const address = event.params.address;
	let userLike;

	if (session) {
		const resp = await supabaseClient
			.from('starred')
			.select('*')
			.eq('address', address)
			.eq('user_id', session.user.id)
			.single();

		userLike = resp.data ? true : false;
	}

	const data = await getDeployedExpressionByAddress(address, supabaseClient);

	return { ...data, userLike };
};
