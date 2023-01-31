import type { ContextRoles } from '$lib/user-context';
import type { Database } from "$lib/types/generated-db-types";

export type ContextInfo = UserContext | OrgContext;

export type UserContext = ContextData & {
    __ContextType: ContextRoles.USER;
};

export type OrgContext = ContextData & {
    orgId: string;
    __ContextType: ContextRoles.ORG;
};

type ContextData = {
    id: string;
    name: string;
    nickname: string;
    avatar_url: string | null;
    role: string;
    website: string | null;
    __ContextType: ContextRoles;
};
