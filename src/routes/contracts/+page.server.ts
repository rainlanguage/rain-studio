import { supabaseClient } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {

    const query = await supabaseClient
        .from('contracts')
        .select('project ( name, logo_url ), metadata, abi, slug')

    if (query.error) throw error(404, 'Not found');

    return { contract: query.data }
}