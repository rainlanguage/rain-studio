import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error as kitError, json as jsonResponse } from '@sveltejs/kit';
import { isEqual } from 'lodash-es';
import type { RequestHandler, RequestEvent } from './$types';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import { ContextRoles } from '$lib/user-context';

/** @type {import('./$types').RequestHandler} */
export const POST: RequestHandler = async (event: RequestEvent) => {
    const { supabaseClient } = await getSupabase(event);
    const { url } = event;
    const userId = url.searchParams.get('userId');
    const orgId = url.searchParams.get('orgId');

    let query;

    const buildQuery = async (
        supabase_: TypedSupabaseClient,
        request_: RequestEvent['request'],
        id_: string,
        context_: ContextRoles
    ) => {
        const {
            order,
            selectedContract,
            selectedInterpreter,
            selectedTags,
            searchValue,
            expressionComponentName
        } = await request_.json();

        let query = supabase_
            .from('draft_expressions_w')
            .select(
                '*, contract ( metadata, project (name, logo_url), id ), interpreter ( metadata, id )'
            );

        if (context_ == ContextRoles.USER) {
            // Do not include draft expressions associated to a organization
            query = query.eq('user_id', id_).is('org_id', null);
        } else {
            query = query.eq('org_id', id_);
        }

        if (selectedContract && selectedContract !== 'all' && selectedContract !== 'no-contract')
            query = query.eq('contract', selectedContract);
        if (selectedContract === 'no-contract') query = query.is('contract', null);
        if (selectedInterpreter) query = query.eq('interpreter', selectedInterpreter);
        if (expressionComponentName)
            query = query.eq('contract_expression', expressionComponentName);
        if (searchValue)
            query = query.textSearch('name', searchValue, {
                type: 'websearch',
                config: 'english'
            });

        if (selectedTags?.length && !isEqual(selectedTags, ['all-tags']))
            query = query.overlaps('tags', selectedTags);
        if (order) query = query.order(...order);

        return new Promise((resolve) => resolve(query));
    };

    if (!userId && !orgId) {
        // Return ALL the public draft_expressions_w
        throw kitError(404, 'Missing user or organization ID');
    } else if (userId && orgId) {
        // Throw error. Cannot return user and org expression at the same time
        throw kitError(404, 'Cannot get user and org expression at same time');
    } else if (userId) {
        // Return the userId expressions
        query = await buildQuery(supabaseClient, event.request, userId, ContextRoles.USER);
    } else if (orgId) {
        // Return the orgId expressions
        query = await buildQuery(supabaseClient, event.request, orgId, ContextRoles.ORG);
    }

    const { data, error } = await query;

    if (error) throw kitError(404, 'Not found');

    return jsonResponse({ draft_expressions: data });
};
