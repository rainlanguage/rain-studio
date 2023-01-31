import type { PageLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';

export const load: PageLoad = async (event) => {
    const { parent } = event;

    // Waiting for the layout to get the Articles
    const { categorisedArticles } = await parent();

    const _mainSlug = categorisedArticles?.[0]?.articles?.[0]?.slug;
    if (_mainSlug) throw redirect(307, `/docs/${_mainSlug}`);

    // If there is not route to the docs, then throw the error
    throw error(500, 'Something went wrong :(');
};
