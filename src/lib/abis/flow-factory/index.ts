import type { ImplementationDataFormat } from '../types';

export const abi = [
	{
		inputs: [
			{
				components: [
					{
						internalType: 'bytes',
						name: 'callerMeta',
						type: 'bytes'
					},
					{
						internalType: 'address',
						name: 'deployer',
						type: 'address'
					}
				],
				internalType: 'struct InterpreterCallerV1ConstructionConfig',
				name: 'config_',
				type: 'tuple'
			}
		],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'flowMinOutputs_',
				type: 'uint256'
			}
		],
		name: 'BadMinStackLength',
		type: 'error'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'i',
				type: 'uint256'
			}
		],
		name: 'InvalidSignature',
		type: 'error'
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'expectedHash',
				type: 'bytes32'
			},
			{
				internalType: 'bytes32',
				name: 'actualHash',
				type: 'bytes32'
			}
		],
		name: 'UnexpectedMetaHash',
		type: 'error'
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'unregisteredHash',
				type: 'bytes32'
			}
		],
		name: 'UnregisteredFlow',
		type: 'error'
	},
	{
		inputs: [],
		name: 'UnsupportedERC1155Flow',
		type: 'error'
	},
	{
		inputs: [],
		name: 'UnsupportedERC20Flow',
		type: 'error'
	},
	{
		inputs: [],
		name: 'UnsupportedERC721Flow',
		type: 'error'
	},
	{
		inputs: [],
		name: 'UnsupportedNativeFlow',
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
				internalType: 'uint256[][]',
				name: 'context',
				type: 'uint256[][]'
			}
		],
		name: 'Context',
		type: 'event'
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
				components: [
					{
						internalType: 'contract IInterpreterV1',
						name: 'interpreter',
						type: 'address'
					},
					{
						internalType: 'contract IInterpreterStoreV1',
						name: 'store',
						type: 'address'
					},
					{
						internalType: 'address',
						name: 'expression',
						type: 'address'
					}
				],
				indexed: false,
				internalType: 'struct Evaluable',
				name: 'evaluable',
				type: 'tuple'
			}
		],
		name: 'FlowInitialized',
		type: 'event'
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
				components: [
					{
						internalType: 'contract IExpressionDeployerV1',
						name: 'deployer',
						type: 'address'
					},
					{
						internalType: 'bytes[]',
						name: 'sources',
						type: 'bytes[]'
					},
					{
						internalType: 'uint256[]',
						name: 'constants',
						type: 'uint256[]'
					}
				],
				indexed: false,
				internalType: 'struct EvaluableConfig[]',
				name: 'config',
				type: 'tuple[]'
			}
		],
		name: 'Initialize',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint8',
				name: 'version',
				type: 'uint8'
			}
		],
		name: 'Initialized',
		type: 'event'
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
				internalType: 'bytes',
				name: 'callerMeta',
				type: 'bytes'
			}
		],
		name: 'InterpreterCallerMeta',
		type: 'event'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'contract IInterpreterV1',
						name: 'interpreter',
						type: 'address'
					},
					{
						internalType: 'contract IInterpreterStoreV1',
						name: 'store',
						type: 'address'
					},
					{
						internalType: 'address',
						name: 'expression',
						type: 'address'
					}
				],
				internalType: 'struct Evaluable',
				name: 'evaluable_',
				type: 'tuple'
			},
			{
				internalType: 'uint256[]',
				name: 'callerContext_',
				type: 'uint256[]'
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'signer',
						type: 'address'
					},
					{
						internalType: 'bytes',
						name: 'signature',
						type: 'bytes'
					},
					{
						internalType: 'uint256[]',
						name: 'context',
						type: 'uint256[]'
					}
				],
				internalType: 'struct SignedContext[]',
				name: 'signedContexts_',
				type: 'tuple[]'
			}
		],
		name: 'flow',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 'data_',
				type: 'bytes'
			}
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bytes[]',
				name: 'data',
				type: 'bytes[]'
			}
		],
		name: 'multicall',
		outputs: [
			{
				internalType: 'bytes[]',
				name: 'results',
				type: 'bytes[]'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'uint256[]',
				name: '',
				type: 'uint256[]'
			},
			{
				internalType: 'uint256[]',
				name: '',
				type: 'uint256[]'
			},
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes'
			}
		],
		name: 'onERC1155BatchReceived',
		outputs: [
			{
				internalType: 'bytes4',
				name: '',
				type: 'bytes4'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			},
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes'
			}
		],
		name: 'onERC1155Received',
		outputs: [
			{
				internalType: 'bytes4',
				name: '',
				type: 'bytes4'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'address',
				name: '',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			},
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes'
			}
		],
		name: 'onERC721Received',
		outputs: [
			{
				internalType: 'bytes4',
				name: '',
				type: 'bytes4'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'contract IInterpreterV1',
						name: 'interpreter',
						type: 'address'
					},
					{
						internalType: 'contract IInterpreterStoreV1',
						name: 'store',
						type: 'address'
					},
					{
						internalType: 'address',
						name: 'expression',
						type: 'address'
					}
				],
				internalType: 'struct Evaluable',
				name: 'evaluable_',
				type: 'tuple'
			},
			{
				internalType: 'uint256[]',
				name: 'callerContext_',
				type: 'uint256[]'
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'signer',
						type: 'address'
					},
					{
						internalType: 'bytes',
						name: 'signature',
						type: 'bytes'
					},
					{
						internalType: 'uint256[]',
						name: 'context',
						type: 'uint256[]'
					}
				],
				internalType: 'struct SignedContext[]',
				name: 'signedContexts_',
				type: 'tuple[]'
			}
		],
		name: 'previewFlow',
		outputs: [
			{
				components: [
					{
						components: [
							{
								internalType: 'address',
								name: 'from',
								type: 'address'
							},
							{
								internalType: 'address',
								name: 'to',
								type: 'address'
							},
							{
								internalType: 'uint256',
								name: 'amount',
								type: 'uint256'
							}
						],
						internalType: 'struct NativeTransfer[]',
						name: 'native',
						type: 'tuple[]'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'address',
								name: 'from',
								type: 'address'
							},
							{
								internalType: 'address',
								name: 'to',
								type: 'address'
							},
							{
								internalType: 'uint256',
								name: 'amount',
								type: 'uint256'
							}
						],
						internalType: 'struct ERC20Transfer[]',
						name: 'erc20',
						type: 'tuple[]'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'address',
								name: 'from',
								type: 'address'
							},
							{
								internalType: 'address',
								name: 'to',
								type: 'address'
							},
							{
								internalType: 'uint256',
								name: 'id',
								type: 'uint256'
							}
						],
						internalType: 'struct ERC721Transfer[]',
						name: 'erc721',
						type: 'tuple[]'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'address',
								name: 'from',
								type: 'address'
							},
							{
								internalType: 'address',
								name: 'to',
								type: 'address'
							},
							{
								internalType: 'uint256',
								name: 'id',
								type: 'uint256'
							},
							{
								internalType: 'uint256',
								name: 'amount',
								type: 'uint256'
							}
						],
						internalType: 'struct ERC1155Transfer[]',
						name: 'erc1155',
						type: 'tuple[]'
					}
				],
				internalType: 'struct FlowTransfer',
				name: '',
				type: 'tuple'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'bytes4',
				name: 'interfaceId',
				type: 'bytes4'
			}
		],
		name: 'supportsInterface',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		stateMutability: 'payable',
		type: 'receive'
	}
];

export const tupleFormat =
	'tuple(tuple(address deployer, bytes[] sources, uint256[] constants) dummyConfig, tuple(address deployer, bytes[] sources, uint256[] constants)[] config)';

const Flow: ImplementationDataFormat = {
	abi,
	initializeTuple: tupleFormat,
	type: 'implementation'
};

export default Flow;
