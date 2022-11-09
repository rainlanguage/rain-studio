import { getSupabase } from "@supabase/auth-helpers-sveltekit"
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
    const { supabaseClient } = await getSupabase(event)
    const slug = event.params.slug

    const query = await supabaseClient.rpc('get_expression_by_slug', { slug })

    if (query.error) throw error(404, 'Not found');

    if (!query.data.length) throw error(404, 'Not found');

    return { expression: query.data[0] }
};