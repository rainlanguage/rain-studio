import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async (event) => {
    const { session } = await getSupabase(event);
    if (session) return { session };
    throw redirect(307, '/sign-in');
};
