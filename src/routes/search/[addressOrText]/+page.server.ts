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
        const typenameSG = result.resultSG?.__typename;
        if (typenameDB == 'Contract') {
            // Redirect to contracts
            throw redirect(307, `/contracts/${result.resultDB.slug}`);
        }

        if (typenameSG == 'Expression') {
            //  Redirect to Expressions
            throw redirect(307, `/expression/${result.resultSG.id}`);
        }
        return { result };
    }

    return { result: null };
};
