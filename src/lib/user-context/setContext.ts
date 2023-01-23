import { isOrgContext, userContextData } from '$lib/stores';
import { error } from '@sveltejs/kit';
import type { ContextInfo } from '$lib/types/context-types';

export const handleSetContext = async (subjectInfo_: any, context_: string) => {
	let dataContext: ContextInfo;
	console.log(context_);
	console.log(subjectInfo_);

	if (context_ == 'user' && subjectInfo_) {
		dataContext = {
			id: subjectInfo_.id,
			name: subjectInfo_.full_name ?? subjectInfo_.username,
			nickname: subjectInfo_.username,
			avatar_url: subjectInfo_.avatar_url,
			role: 'user',
			website: subjectInfo_.website
		};
		isOrgContext.set(false);
	} else if (context_ == 'org' && subjectInfo_) {
		dataContext = {
			id: subjectInfo_.id,
			name: subjectInfo_.info_org.name,
			nickname: subjectInfo_.info_org.nickname,
			avatar_url: subjectInfo_.info_org.avatar_url,
			role: subjectInfo_.role,
			website: subjectInfo_.info_org.website
		};
		isOrgContext.set(true);
	} else {
		throw error(400, 'Wrong context or data');
	}

	userContextData.set(dataContext);
};
