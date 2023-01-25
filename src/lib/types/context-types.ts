export type ContextInfo = UserContext | OrgContext;

export type UserContext = ContextData & {
	__ContextType: 'USER';
};

export type OrgContext = ContextData & {
	orgId: string;
	__ContextType: 'ORGANIZATION';
};

type ContextData = {
	id: string;
	name: string;
	nickname: string;
	avatar_url: string;
	role: string;
	website: string;
	__ContextType: 'USER' | 'ORGANIZATION';
};
