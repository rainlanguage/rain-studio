import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
	const { params } = event;
	// const session = await getServerSession(event);

	// TODO: Get based on the params.type and the params.slug
	console.log('slug: ', params);
};