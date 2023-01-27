import type { Profile, Organization } from '$lib/types/app-types';
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

    public static fromDataOrg(dataOrg_: Organization): ContextInfo {
        return {
            id: dataOrg_.id,
            orgId: dataOrg_.info_org.id,
            name: dataOrg_.info_org.name,
            nickname: dataOrg_.info_org.nickname,
            avatar_url: dataOrg_.info_org.avatar_url,
            role: dataOrg_.role,
            website: dataOrg_.info_org.website,
            __ContextType: ContextRoles.ORG
        };
    }
}
