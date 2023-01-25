import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, fail, error as sveltekitError } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ContextInfo } from '$lib/types/context-types';

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
		if (session) {
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
		} else {
			return fail(401, { error: 'User not logged.' });
		}
	},
	changeContext: async (event) => {
		const { request, cookies } = event;
		const { supabaseClient, session } = await getSupabase(event);

		if (!session) throw sveltekitError(401, { error: 'User not logged' });

		const { user } = session;
		const data = await request.formData();
		const userId = data.get('user-id');
		const memberId = data.get('member-id');

		let dataContext: ContextInfo;

		if (userId) {
			dataContext = {
				id: user.id,
				name: user.full_name ?? user.username,
				nickname: user.username,
				avatar_url: user.avatar_url,
				role: 'user',
				website: user.website,
				__ContextType: 'USER'
			};
		}

		if (memberId) {
			const { error: errorOrg, data: dataOrg } = await supabaseClient
				.from('org_member')
				.select(`id, role, user_id, info_org: organizations(*)`)
				.eq('id', memberId)
				.single();

			if (errorOrg) fail(400, { error: errorOrg });

			if (dataOrg.user_id != user.id) fail(401, { error: 'Not have right to access.' });

			dataContext = {
				id: dataOrg.id,
				orgId: dataOrg.info_org.id,
				name: dataOrg.info_org.name,
				nickname: dataOrg.info_org.nickname,
				avatar_url: dataOrg.info_org.avatar_url,
				role: dataOrg.role,
				website: dataOrg.info_org.website,
				__ContextType: 'ORGANIZATION'
			};
		}

		// If the user is logged, should have the supabase cookie
		const { expires_at } = JSON.parse(cookies.get('supabase-auth-token'));
		cookies.set('rain-studio-context', JSON.stringify(dataContext), {
			path: '/',
			maxAge: expires_at,
			httpOnly: false
		});
	}
};
