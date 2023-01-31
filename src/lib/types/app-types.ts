import type { ContextInfo } from '$lib/types/context-types';
import type { OrganizationRow, Wallet_UsersRow } from '$lib/types/types';

export type Profile = Omit<Wallet_UsersRow, 'created_at'>;
export type Organization = OrganizationRow;

export type MemberOrg = {
    id: string;
    role: string;
    info_org: Organization;
};

export interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    token_type: string;
    orgContext: ContextInfo;
    user: Profile;
}
