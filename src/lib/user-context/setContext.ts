import { isOrgContext, userContextData } from '$lib/stores';
import { error } from '@sveltejs/kit';
import type { ContextInfo } from '$lib/types/context-types';

export const handleSetContext = async (subjectInfo_: any, context_: string) => {
	let dataContext: ContextInfo;

	if (subjectInfo_) {
		if (context_ == 'user') {
			isOrgContext.set(false);

			dataContext = {
				id: subjectInfo_.id,
				name: subjectInfo_.full_name ?? subjectInfo_.username,
				nickname: subjectInfo_.username,
				avatar_url: subjectInfo_.avatar_url,
				role: 'user',
				website: subjectInfo_.website
			};
		} else if (context_ == 'org') {
			isOrgContext.set(true);

			dataContext = {
				id: subjectInfo_.id,
				name: subjectInfo_.info_org.name,
				nickname: subjectInfo_.info_org.nickname,
				avatar_url: subjectInfo_.info_org.avatar_url,
				role: subjectInfo_.role,
				website: subjectInfo_.info_org.website
			};
		}

		userContextData.set(dataContext);
	}
};
