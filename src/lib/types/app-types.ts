export type Profile = {
    avatar_url: string | null;
    full_name: string | null;
    id: string;
    username: string;
    website: string | null;
};
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
