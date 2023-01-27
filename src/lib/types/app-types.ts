import type { ContextInfo } from '$lib/types/context-types';

export type Profile = {
    id: string;
    full_name: string | null;
    username: string;
    avatar_url: string | null;
    website: string | null;
};

export interface Session {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at?: number;
    token_type: string;
    orgContext: ContextInfo;
    user: Profile;
}

export type Organization = {
    id: string;
    role: string;
    info_org: OrganizationInfo;
};

type OrganizationInfo = {
    id: string;
    created_at: string;
    name: string;
    nickname: string;
    avatar_url: string;
    website: string;
};
