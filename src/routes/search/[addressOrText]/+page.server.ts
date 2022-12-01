import type { PageServerLoad } from './$types';

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

	if (success) return { result };

	return { result: null };
};
