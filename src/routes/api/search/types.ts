/* eslint-disable @typescript-eslint/no-explicit-any */
export type SearchResponse = {
	success: boolean;
	data?: {
		id: string;
		__typename: string;
		[key: string]: any;
	};
	error?: {
		message: string;
	};
};

export type DataResponse = {
	id: string;
	type: string;
	[key: string]: any;
};
