import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async ({ cookies }) => {
    cookies.delete('rain-studio-session');

    throw redirect(307, '/');
};
