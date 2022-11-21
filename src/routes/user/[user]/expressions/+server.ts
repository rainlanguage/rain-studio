import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    const { supabaseClient } = await getSupabase(event)
    const query = await supabaseClient
        .from('draft_expressions')
        .select('*, contract ( metadata, project (name, logo_url), id ), interpreter ( metadata, id )').order('created_at', { ascending: false });

    if (query?.error) throw error(404, 'Not found');

    const draft_expressions = query.data;

    return new Response(JSON.stringify({ draft_expressions }));
}