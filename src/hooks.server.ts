import { env } from '$env/dynamic/public'
import '$lib/supabaseClient'

console.log('server', env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY)