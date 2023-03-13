import { supabaseClient } from '$lib/supabaseClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { session } = await getSupabase(event);
	if (!session) throw redirect(307, '/sign-in');
	const contractQuery = await supabaseClient
		.from('contracts')
		.select('*, project (*)')
		.not('metadata', 'is', null);

	const interpreterQuery = await supabaseClient.from('interpreters').select('*');

	if (contractQuery.error || interpreterQuery.error) throw error(404, 'Not found');

	return { contracts: contractQuery.data, interpreters: interpreterQuery.data };
};
