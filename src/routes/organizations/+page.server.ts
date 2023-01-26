import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, fail, error as sveltekitError } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import type { ContextInfo } from '$lib/types/context-types';
import type { Profile } from '$lib/types/app-types';
import { ContextRoles } from '$lib/user-context';

/** @type {import('./$types').PageData} */
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
    newOrg: async (event: RequestEvent) => {
        const { request } = event;
        const { supabaseClient, session } = await getSupabase(event);
        if (session) {
            const { user } = session;

            const data = await request.formData();
            const orgName = data.get('OrgName');
            const orgNickname = data.get('OrgNickname');
            if (orgName && orgNickname) {
                const { data: dataOrg, error: errorOrg } = await supabaseClient
                    .from('organizations')
                    .insert({
                        name: orgName,
                        nickname: orgNickname.toString().toLowerCase()
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
        } else {
            return fail(401, { error: 'User not logged.' });
        }
    },
    changeContext: async (event: RequestEvent) => {
        const { request, cookies } = event;
        const { supabaseClient, session } = await getSupabase(event);

        if (!session) throw sveltekitError(401, { message: 'User not logged' });

        const user = session.user as unknown as Profile;

        const data = await request.formData();
        const userId = data.get('user-id');
        const memberId = data.get('member-id');

        let dataContext: ContextInfo | null = null;

        if (userId) {
            dataContext = {
                id: user.id,
                name: user.full_name ?? user.username,
                nickname: user.username,
                avatar_url: user.avatar_url ?? null,
                role: 'user',
                website: user.website,
                __ContextType: ContextRoles.USER
            };
        }

        if (memberId) {
            const { error: errorOrg, data: dataOrg } = await supabaseClient
                .from('org_member')
                .select(`id, role, user_id, info_org: organizations(*)`)
                .eq('id', memberId)
                .single();

            if (errorOrg) fail(400, { error: errorOrg });

            if (dataOrg) {
                if (dataOrg.user_id != user.id) fail(401, { error: 'Not have right to access.' });

                dataContext = {
                    id: dataOrg.id,
                    orgId: dataOrg.info_org.id,
                    name: dataOrg.info_org.name,
                    nickname: dataOrg.info_org.nickname,
                    avatar_url: dataOrg.info_org.avatar_url,
                    role: dataOrg.role,
                    website: dataOrg.info_org.website,
                    __ContextType: ContextRoles.ORG
                };
            }
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
