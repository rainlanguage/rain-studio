import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const session = await getServerSession(event);
	if (session) {
		throw redirect(307, '/profile');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async (event) => {
		// TODO log the user in
		console.log('Action called');
	}
};
