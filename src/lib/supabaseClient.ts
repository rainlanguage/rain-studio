import { createClient } from '@supabase/auth-helpers-sveltekit';

export let supabaseClient = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const refreshClient = (token_access) => {
	supabaseClient = createClient(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_ANON_KEY,
		{
			global: {
				headers: {
					Authorization: `Bearer ${token_access}`
				}
			}
		}
	);
};
