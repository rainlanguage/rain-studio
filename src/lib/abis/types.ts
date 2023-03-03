import type { Abi } from 'abitype';

type DataFormat = {
	abi: Abi;
	type: 'contract' | 'implementation';
};

export type ContractDataFormat = DataFormat & {
	type: 'contract';
};

export type ImplementationDataFormat = DataFormat & {
	type: 'implementation';
	initializeTuple: string;
};
