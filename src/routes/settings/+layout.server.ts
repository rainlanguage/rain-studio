import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
    const session = await getServerSession(event);
    if (session) return { session };
    throw redirect(307, '/sign-in');
}
