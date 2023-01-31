import type { ContextRoles } from '$lib/user-context';

export type ContextInfo = UserContext | OrgContext;

export type UserContext = ContextData & {
    __ContextType: ContextRoles.USER;
};

export type OrgContext = ContextData & {
    orgId: string;
    __ContextType: ContextRoles.ORG;
};

/**
 * Custom type since it's intended to handle and check between an User or Org context.
 */
type ContextData = {
    id: string;
    name: string;
    nickname: string;
    avatar_url: string | null;
    role: string;
    website: string | null;
    __ContextType: ContextRoles;
};
