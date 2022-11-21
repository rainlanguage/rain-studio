import { getSupabase } from "@supabase/auth-helpers-sveltekit"
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    const { supabaseClient } = await getSupabase(event)
    const slug = event.params.slug
    let userQuery, contractQuery, interpreterQuery

    const query = await supabaseClient.rpc('get_expression_by_slug', { slug })
    if (query?.data?.[0]) {
        userQuery = await supabaseClient.from('profiles').select('*').filter('id', 'eq', query.data[0].user_id)
        contractQuery = await supabaseClient.from('contracts').select('*, project (*)').filter('id', 'eq', query.data[0].contract)
        interpreterQuery = await supabaseClient.from('interpreters').select('*').filter('id', 'eq', query.data[0].interpreter)
    }

    if (query.error || userQuery?.error || contractQuery?.error || interpreterQuery?.error) throw error(404, 'Not found');

    if (!query.data.length || !userQuery?.data.length || !contractQuery?.data.length || !interpreterQuery?.data.length) throw error(404, 'Not found');

    return { expression: query.data[0], user: userQuery.data[0], contract: contractQuery.data[0], interpreter: interpreterQuery.data[0] }
};