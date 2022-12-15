import { getServerSession } from '@supabase/auth-helpers-sveltekit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const session = await getServerSession(event);

	return { session };
}
