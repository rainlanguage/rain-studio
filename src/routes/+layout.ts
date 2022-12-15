import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const { data } = event;
	return { session: data.session };
};
