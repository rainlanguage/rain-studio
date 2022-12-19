import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    console.log(event)
    const { supabaseClient, session } = await getSupabase(event)
    if (!session) throw redirect(307, '/sign-in')
    else {
        const { data } = await supabaseClient
            .from('profiles')
            .select(`username`)
            .eq('id', session.user.id)
            .single();

        throw redirect(307, `/user/${data?.username}/expressions`)
    }
    return {};
};