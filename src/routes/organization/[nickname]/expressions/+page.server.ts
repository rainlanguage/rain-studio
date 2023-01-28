import type { PageServerLoad } from '../$types';
import { error as sveltekitError, redirect } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { ContextRoles } from '$lib/user-context';

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
    const { supabaseClient, session } = await getSupabase(event);
    if (!session) {
        throw redirect(307, '/sign-in');
    }

    const { fetch, params } = event;
    const { orgContext } = session;
    const nickname = params.nickname.toLowerCase();

    if (orgContext.__ContextType == ContextRoles.USER) {
        throw redirect(307, `/user/${orgContext.nickname}/expressions`);
    } else {
        if (event.url.pathname != `/organization/${orgContext.nickname}/expressions`) {
            throw redirect(307, `/organization/${orgContext.nickname}/expressions`);
        }
    }

    const { data: dataOrg } = await supabaseClient
        .from('organizations')
        .select('*, members:org_member(*)')
        .eq('nickname', nickname)
        .single();

    if (!dataOrg) throw sveltekitError(404, 'Not found');

    if (orgContext.__ContextType != ContextRoles.ORG || orgContext.nickname != nickname) {
        throw sveltekitError(401, 'Not a member or wrong user');
    }

    // getting all contracts
    const contractsQuery = await supabaseClient.from('contracts').select('*');

    // getting all interpreters
    const interpretersQuery = await supabaseClient.from('interpreters').select('*');

    // Using an API endpoint here to the current org expressions.
    // This endpoint takes the userId OR orgId as the IDs are generally more readily available
    // in the app. It's required use the searchParams as reference
    const resp = await fetch(`/api/expressions?orgId=${dataOrg.id}`, {
        method: 'POST',
        body: JSON.stringify({ order: ['created_at', { ascending: false }] })
    });

    let draft_expressions = [];
    if (resp.ok) ({ draft_expressions } = await resp.json());

    // TODO: Missing get the tags and deployed expressions by the org
    // const tagResp
    // const deployedExpressions

    return {
        deployedExpressions: [] as any[],
        org: dataOrg.data,
        draft_expressions,
        // isWriteRole: orgContext.role === 'writer',
        isWriteRole: true,
        contracts: contractsQuery.data,
        interpreters: interpretersQuery.data,
        tags: [] as string[],
        userContext: orgContext
    };
};
