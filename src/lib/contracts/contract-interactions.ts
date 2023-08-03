import {
	getContract,
	prepareWriteContract,
	writeContract,
	sendTransaction,
	prepareSendTransaction,
	waitForTransaction
} from '@wagmi/core';
import type { Abi, AbiFunction } from 'abitype';
import type { WaitForTransactionResult, Address } from '@wagmi/core';

export const prepareWriteFunction = async (
	address_: Address,
	abi_: Abi,
	functionName_: string,
	args_?: any
) => {
	console.log(args_);
	console.log(args_ ? [args_] : undefined);
	// const { request } = await prepareWriteContract({
	const a = await prepareWriteContract({
		address: address_,
		abi: abi_,
		functionName: functionName_,
		args: args_
	});

	console.log('a.mode: ', a.mode);
	console.log('a.result: ', a.result);

	return a.request;
};
