import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { supabaseClient, session } = await getSupabase(event);
	if (!session) throw redirect(307, '/sign-in');
	const { url } = event;
	let create = false;
	const ref = url.searchParams.get('ref');

	if (ref == 'create') create = true;

	return { create };
};

/** @type {import('./$types').Actions} */
export const actions = {
	newOrg: async (event) => {
		const { request } = event;
		const { supabaseClient, session } = await getSupabase(event);
		const { user } = session;

		const data = await request.formData();
		const orgName = data.get('OrgName');
		const orgNickname = data.get('OrgNickname');

		const { data: dataOrg, error: errorOrg } = await supabaseClient
			.from('organizations')
			.insert({
				name: orgName,
				nickname: orgNickname.toLowerCase()
			})
			.select('*')
			.single();

		if (errorOrg) {
			return fail(400, { error: errorOrg });
		}

		const { error: errorMember } = await supabaseClient.from('org_member').insert({
			user_id: user.id,
			org_id: dataOrg.id,
			role: 'admin'
		});

		if (errorMember) {
			return fail(400, { error: errorMember });
		}
	}
};
