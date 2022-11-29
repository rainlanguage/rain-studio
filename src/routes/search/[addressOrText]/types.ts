/* eslint-disable @typescript-eslint/no-explicit-any */
export type DataResponse = {
	id: string;
	type: string;
	[key: string]: any;
};

export type ContractDBResponse = {
	id: string;
	created_at: string;
	metadata: {
		[key: string]: string;
		addresses: ContractAddresses[];
	};
	project: ProjectDBResponse;
	abi: any;
	slug: string;
};

type ContractAddresses = {
	chainId: string;
	knownAddresses: string[];
};

export type ProjectDBResponse = {
	id: string;
	created_at: string;
	name: string;
	logo_url: string;
};

export type AccountDBResponse = {
	id: string;
	linked_at: string;
	address: string;
	user_id: ProfileDBResponse;
};

export type ProfileDBResponse = {
	id: string;
	updated_at: string;
	username: string;
	full_name: string;
	avatar_url: string;
	website: string;
};

export type InterpreterDBResponse = {
	id: string;
	created_at: string;
	metadata: {
		[key: string]: string;
		addresses: InterpreterAddresses[];
	};
	description: string;
};

type InterpreterAddresses = {
	chainId: string;
	knownAddresses: InterpreterKnowAddress[];
};

type InterpreterKnowAddress = {
	deployer: string;
	integrity: string;
	interpreter: string;
};
