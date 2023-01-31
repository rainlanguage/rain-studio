import type { Profile, MemberOrg } from '$lib/types/app-types';
import type { ContextInfo } from '$lib/types/context-types';

export enum ContextRoles {
    ORG = 'ORGANIZATION',
    USER = 'USER'
}

export class ContextBuilder {
    public static fromProfile(profile_: Profile): ContextInfo {
        return {
            id: profile_.id,
            name: profile_.full_name ?? profile_.username,
            nickname: profile_.username,
            avatar_url: profile_.avatar_url ?? null,
            role: 'user',
            website: profile_.website,
            __ContextType: ContextRoles.USER
        };
    }

    public static fromDataMember(dataMemberOrg_: MemberOrg): ContextInfo {
        return {
            id: dataMemberOrg_.id,
            orgId: dataMemberOrg_.info_org.id,
            name: dataMemberOrg_.info_org.name,
            nickname: dataMemberOrg_.info_org.nickname,
            avatar_url: dataMemberOrg_.info_org.avatar_url,
            role: dataMemberOrg_.role,
            website: dataMemberOrg_.info_org.website,
            __ContextType: ContextRoles.ORG
        };
    }
}
