import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { fetch, params } = event;
	const { addressOrText } = params;
	const resp = await fetch(`/api/search`, {
		method: 'POST',
		body: JSON.stringify({ addressOrText }),
		headers: {
			'content-type': 'application/json'
		}
	});

	const { success, result } = await resp.json();

	if (success) {
		const typenameDB = result.resultDB?.type;
		if (typenameDB == 'Contract') {
			// Redirect to contracts
			throw redirect(307, `/contracts/${result.resultDB.slug}`);
		}

		if (typenameDB == 'Expression') {
			// TODO: Redirect to Expressions
		}
		return { result };
	}

	return { result: null };
};
