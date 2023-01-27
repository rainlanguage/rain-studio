import type { Session } from '$lib/types/app-types';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';

declare module '@supabase/auth-helpers-sveltekit' {
    let ExtendedEvent: {
        supabaseClient: TypedSupabaseClient;
        session: Session | null;
    };
    function getSupabase(event: RequestEvent | ServerLoadEvent | LoadEvent): Promise<{
        supabaseClient: TypedSupabaseClient;
        session: Session | null;
    }>;
}
