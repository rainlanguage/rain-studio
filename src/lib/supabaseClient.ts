import { createClient } from '@supabase/auth-helpers-sveltekit';

export const supabaseClient = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    /**
     * The supabase options without auth. Use the default value as normal if it is undefined.
     */
    undefined,
    /**
     * Supabase cookie options. Rename the cookie for visibility
     */
    {
        name: 'rain-studio-session'
    }
);
