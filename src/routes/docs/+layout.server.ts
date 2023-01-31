import type { LayoutServerLoad } from './$types';
import { slugFromPath } from '$lib/utils/slugFromPath';
import { forEach } from 'lodash-es';

export const load: LayoutServerLoad = async (event) => {
    const modules = import.meta.glob(`/src/docs/**/*.{md,svx,svelte.md}`);
    const categoryMeta = import.meta.glob(`/src/docs/**/*.json`);

    // getting and sorting the categories
    const categoryPromises = Object.entries(categoryMeta).map(([path, resolver]) =>
        resolver().then((meta) => ({
            slug: path.split('/')[3],
            category: meta.category
        }))
    );
    const categories = await Promise.all(categoryPromises);

    categories.sort(function (a, b) {
        if (a.slug < b.slug) {
            return -1;
        }
        if (a.slug > b.slug) {
            return 1;
        }
        return 0;
    });

    // getting and filtering the articles
    const articlePromises = Object.entries(modules).map(([path, resolver]) =>
        resolver().then((article) => ({
            slug: slugFromPath(path)?.split('-').slice(1).join('-'),
            path,
            file: path.split('/').pop(),
            categorySlug: path.split('/')[3],
            ...(article as unknown as App.MdsvexFile).metadata
        }))
    );

    const articles = await Promise.all(articlePromises);

    const publishedArticles = articles.filter((article) => article.published);

    // categorising and sorting the articles
    const categorisedArticles = categories.map((category) => {
        return {
            ...category,
            articles: publishedArticles
                .filter((article) => article.categorySlug == category.slug)
                .sort(function (a, b) {
                    if (a.file < b.file) {
                        return -1;
                    }
                    if (a.file > b.file) {
                        return 1;
                    }
                    return 0;
                })
        };
    });

    return { categorisedArticles };
};
