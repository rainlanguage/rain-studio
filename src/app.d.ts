// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare namespace App {
    interface Supabase {
        Database: import('./lib/types/generated-db-types').Database;
        SchemaName: 'public';
    }
    // interface Locals {}
    interface PageData {
        session: import('./lib/types/app-types').Session | null;
        profile: import('./lib/types/app-types').Profile | null;
        wallets_linked: string[] | null;
        organizations: import('./lib/types/app-types').Organization[] | null;
        userContext: import('./lib/types/context-types').ContextInfo | null;
    }
    // interface Error {}
    // interface Platform {}

    interface MdsvexFile {
        default: import('svelte/internal').SvelteComponent;
        metadata: Record<string, string>;
    }

    type MdsvexResolver = () => Promise<MdsvexFile>;
}
