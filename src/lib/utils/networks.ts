import { allChainsData, type ChainData } from 'svelte-ethers-store';

export const networkOptions = [
	{ label: 'All', value: -1 },
	{ label: 'Polygon', value: 137 },
	{ label: 'Mumbai', value: 80001 }
];

export const getNetworkByChainId = (chainId_: number | string): ChainData | undefined => {
	return allChainsData.find((chain_) => chain_.chainId == chainId_);
};

export const getNetworksByChainIds = (chainId_: Array<number | string>): ChainData[] => {
	return allChainsData.filter((chain_) => chainId_.includes(chain_.chainId));
};
