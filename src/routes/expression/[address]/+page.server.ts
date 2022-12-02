import { getDeployedExpressionByAddress } from '$lib/expressions/expressions';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {

    const { supabaseClient } = await getSupabase(event);
    const address = event.params.address

    return await getDeployedExpressionByAddress(address, supabaseClient)
};