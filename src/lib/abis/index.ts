import clone from './clone-factory';
import flow from './flow-factory';
import flowERC20 from './flow-erc20-factory';
import flowERC721 from './flow-erc721-factory';
import orderbook from './orderbook';
import type { ContractDataFormat, ImplementationDataFormat } from './types';

export function getContractInfo(
	slug_: string
): ContractDataFormat | ImplementationDataFormat | null {
	if (slug_ == 'orderbook') return orderbook;
	if (slug_ == 'flow-factory') return flow;
	if (slug_ == 'flow-erc20-factory') return flowERC20;
	if (slug_ == 'flow-erc721-factory') return flowERC721;

	return null;
}

export function getCloneFactory() {
	return clone;
}
