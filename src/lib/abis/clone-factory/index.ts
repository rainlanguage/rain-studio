import { ethers } from 'ethers';

const address = '0xdbcf05952ebb83feaf98a63923f3adcf856b0d76';

const abi = [
	{
		inputs: [],
		name: 'ZeroImplementation',
		type: 'error'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'sender',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'implementation',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'clone',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'bytes',
				name: 'data',
				type: 'bytes'
			}
		],
		name: 'NewClone',
		type: 'event'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'implementation_',
				type: 'address'
			},
			{
				internalType: 'bytes',
				name: 'data_',
				type: 'bytes'
			}
		],
		name: 'clone',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	}
];

export const cloneFactory = new ethers.Contract(address, abi);

export default cloneFactory;
