import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { supabaseClient, session } = await getSupabase(event)
    // const { data: rainUser, error } = await supabaseClient.from("wallets_linked").select("*").eq("address", "0x49ec07D1f17C5A8f5acbAB2d5d19EE12b58cCa1e")
    // console.log(rainUser)
    const { data, error } = await supabaseClient.from("starred").select("foreign_key(*, contract_expression, notes, contract(*, project (*)), interpreter(*), user_id(*))").eq("user_id", "43635fcc-f55f-401e-8605-896ae206aaa8").eq("starred", "draft_expression")
    // const { data, error } = await supabaseClient.from("draft_expressions").select("*").eq("id", "7a961899-f494-4a2b-b9f8-6822bea0178e")
    // console.log(JSON.stringify(rainStarred, null, 2))
    const rainStarred = data?.map(v => v.foreign_key)
    return { rainStarred }
};