import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, error as sveltekitError } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import type { Organization } from '$lib/types/app-types';

export const load: PageServerLoad = async (event) => {
    const { session, supabaseClient } = await getSupabase(event);
    const org_nickname = event.params.org_nickname;

    if (!session) throw redirect(307, '/sign-in');

    const { data, error } = await supabaseClient
        .from('organizations')
        .select('*, org_members: org_member(*)')
        .eq('nickname', org_nickname.toLowerCase())
        .single();

    if (error) throw sveltekitError(404, 'Organization not found');

    const dataParents = await event.parent();

    const organization = dataParents.organizations?.find(
        (org_) => org_.info_org.nickname == org_nickname
    );

    if (!organization) throw sveltekitError(401, 'Do not have permissions to manage');

    const orgData = data as Organization['info_org'] & {
        created_at: string;
        user_id: string;
        role: string;
        org_id: string;
        id: string;
    };

    return { orgData };
};
