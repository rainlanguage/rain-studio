import { env } from '$env/dynamic/public'

import '$lib/supabaseClient'

console.log('client', env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)