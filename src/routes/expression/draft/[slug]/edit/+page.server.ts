import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, redirect } from '@sveltejs/kit';
import type {
    ExpressionRowFull,
    ExpressionRow,
    ContractRowFull,
    InterpreterRowFull
} from '$lib/types/types';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event): Promise<{ expression: ExpressionRowFull; noFooter: true }> {
    const { supabaseClient, session } = await getSupabase(event);

    // if there's no session at all, have them sign in
    if (!session) throw redirect(307, '/sign-in');

    const slug = event.params.slug;
    let userQuery, contractQuery, interpreterQuery;

    const query = (await supabaseClient.rpc('get_expression_by_slug_w', {
        slug
    })) as PostgrestSingleResponse<ExpressionRow[]>;

    // if this isn't their expression, they can't access the edit page
    if (query?.data?.[0].user_id !== session?.user.id) throw error(404, 'Not found');

    if (query?.data?.[0]) {
        userQuery = await supabaseClient
            .from('wallet_users')
            .select('*')
            .filter('id', 'eq', query.data[0].user_id)
            .single();
        if (query.data[0]?.contract)
            contractQuery = await supabaseClient
                .from('contracts')
                .select('*, project (*)')
                .filter('id', 'eq', query.data[0].contract)
                .single();
        interpreterQuery = await supabaseClient
            .from('interpreters')
            .select('*')
            .filter('id', 'eq', query.data[0].interpreter)
            .single();
    }

    // catch all the errors
    if (query.error || userQuery?.error || contractQuery?.error || interpreterQuery?.error)
        throw error(404, 'Not found');

    // and make sure there's data for everything
    if (!query.data.length || !userQuery?.data || !interpreterQuery?.data)
        throw error(404, 'Not found');

    return {
        noFooter: true,
        expression: {
            ...query.data[0],
            user_id: userQuery.data,
            contract: contractQuery?.data as unknown as ContractRowFull,
            interpreter: interpreterQuery.data as InterpreterRowFull
        }
    };
}
