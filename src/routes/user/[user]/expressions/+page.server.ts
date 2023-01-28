import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { getDeployedExpressionsForUser } from '$lib/expressions/expressions';
import { ContextRoles } from '$lib/user-context';

// /** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
    const { supabaseClient, session } = await getSupabase(event);
    if (!session) {
        throw redirect(307, '/sign-in');
    }

    const { fetch, params } = event;
    const { orgContext } = session;

    if (orgContext.__ContextType == ContextRoles.ORG) {
        throw redirect(307, `/organization/${orgContext.nickname}/expressions`);
    }

    const userQuery = await supabaseClient
        .from('wallet_users')
        .select('*')
        .eq('username', params.user)
        .single();

    if (!userQuery?.data) throw error(404, 'Not found');

    // getting all contracts
    const contractsQuery = await supabaseClient.from('contracts').select('*');

    // getting all interpreters
    const interpretersQuery = await supabaseClient.from('interpreters').select('*');

    // Using an API endpoint here to the current org expressions.
    // This endpoint takes the userId OR orgId as the IDs are generally more readily available
    // in the app. It's required use the searchParams as reference
    const resp = await fetch(`/api/expressions?userId=${session?.user.id}`, {
        method: 'POST',
        body: JSON.stringify({ order: ['created_at', { ascending: false }] })
    });

    const tagResp = await supabaseClient.rpc('get_unique_tags_for_user_w').single();

    if (tagResp.error) throw error(404, 'Not found');
    const tags = tagResp.data.tags?.slice(1, -1)?.split(',');

    let draft_expressions;
    if (resp.ok) ({ draft_expressions } = await resp.json());
    const deployedExpressions = await getDeployedExpressionsForUser(userQuery.data, supabaseClient);

    return {
        deployedExpressions,
        user: userQuery.data,
        draft_expressions,
        currentUser: session?.user.id == userQuery.data.id,
        contracts: contractsQuery.data,
        interpreters: interpretersQuery.data,
        tags
    };
};
