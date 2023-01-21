import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error as kitError, json as jsonResponse } from '@sveltejs/kit';
import { isEqual } from 'lodash-es';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { order, selectedContract, selectedInterpreter, selectedTags, searchValue, expressionComponentName } = await event.request.json()
	const { supabaseClient } = await getSupabase(event);
	let query = supabaseClient
		.from('draft_expressions_w')
		.select('*, contract ( metadata, project (name, logo_url), id ), interpreter ( metadata, id )')
		.eq('user_id', event.params.user);
	if (selectedContract && selectedContract !== 'all' && selectedContract !== 'no-contract')
		query = query.eq('contract', selectedContract);
	if (selectedContract === 'no-contract') query = query.is('contract', null);
	if (selectedInterpreter) query = query.eq('interpreter', selectedInterpreter);
	if (expressionComponentName) query = query.eq('contract_expression', expressionComponentName);
	if (searchValue)
		query = query.textSearch('name', searchValue, {
			type: 'websearch',
			config: 'english'
		});

	if (selectedTags?.length && !isEqual(selectedTags, ['all-tags'])) query = query.overlaps('tags', selectedTags)
	if (order) query = query.order(...order)
	const { data, error } = await query;
	console.log(data)
	if (error) throw kitError(404, 'Not found');
	const draft_expressions = data;
	return jsonResponse({ draft_expressions });
};
