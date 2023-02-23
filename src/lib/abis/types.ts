type DataFormat = {
	abi: any[];
	type: 'contract' | 'implementation';
};

export type ContractDataFormat = DataFormat & {
	type: 'contract';
};

export type ImplementationDataFormat = DataFormat & {
	type: 'implementation';
	initializeTuple: string;
};
