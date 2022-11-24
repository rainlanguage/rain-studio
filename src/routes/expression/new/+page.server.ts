import { supabaseClient } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const contractQuery = await supabaseClient
        .from('contracts')
        .select('*, project (*)');

    const interpreterQuery = await supabaseClient.from('interpreters').select('*')

    if (contractQuery.error || interpreterQuery.error) throw error(404, 'Not found');

    return { contracts: contractQuery.data, interpreters: interpreterQuery.data };
}