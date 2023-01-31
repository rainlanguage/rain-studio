import { redirect } from '@sveltejs/kit';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
    const session = await getServerSession(event);

    if (!session) {
        throw redirect(307, '/sign-in');
    }
}
