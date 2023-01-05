import type { PageLoad } from './$types';
import { slugFromPath } from '$lib/utils/slugFromPath';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob(`/src/docs/guides/*.{md,svx,svelte.md}`);

	let match: { path?: string; resolver?: App.MdsvexResolver } = {};
	for (const [path, resolver] of Object.entries(modules)) {
		console.log('1', slugFromPath(path))
		console.log('2', params.slug)
		if (slugFromPath(path) === params.slug) {
			match = { path, resolver: resolver as unknown as App.MdsvexResolver };
			break;
		}
	}

	const post = await match?.resolver?.();
	console.log(post)

	if (!post || !post.metadata.published) {
		console.log('bad')
		throw error(404); // Couldn't resolve the post
	}

	return {
		component: post.default,
		frontmatter: post.metadata
	};
};
