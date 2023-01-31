import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, fail, error as sveltekitError } from '@sveltejs/kit';
import type { PageServerLoad, RequestEvent } from './$types';
import type { ContextInfo } from '$lib/types/context-types';
import type { MemberOrg, Profile } from '$lib/types/app-types';
import { ContextBuilder } from '$lib/user-context';
import { generateCookie } from '$lib/utils/auth';

/** @type {import('./$types').PageData} */
export const load: PageServerLoad = async (event) => {
    const session = await getServerSession(event);

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
            const data = await request.formData();
            const orgName = data.get('OrgName');
            const orgNickname = data.get('OrgNickname');
            if (orgName && orgNickname) {
                const name_ = orgName.toString();
                const nickname_ = orgNickname.toString();

                // The RPC function use the current session to link to user_id
                const { error } = await supabaseClient.rpc('create_organization', {
                    name_,
                    nickname_
                });

                if (error) {
                    return fail(400, error);
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
            dataContext = ContextBuilder.fromProfile(user);
        }

        if (memberId) {
            const { error: errorOrg, data: dataMember } = await supabaseClient
                .from('org_member')
                .select(`id, role, user_id, info_org: organizations(*)`)
                .eq('id', memberId)
                .single();

            if (errorOrg) fail(400, { error: errorOrg });

            if (dataMember) {
                if (dataMember.user_id != user.id)
                    fail(401, { error: 'Not have right to access.' });

                dataContext = ContextBuilder.fromDataMember(dataMember as MemberOrg);
            }
        }

        // Get the expire times from the current cookie/session
        const { expires_in, expires_at } = session;

        const newCookie = await generateCookie(user, dataContext, {
            exp_in: expires_in,
            exp_at: expires_at
        });

        cookies.set('rain-studio-session', JSON.stringify(newCookie), {
            path: '/',
            maxAge: expires_at,
            httpOnly: false
        });
    }
};
