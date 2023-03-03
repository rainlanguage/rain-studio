import type { Abi } from 'abitype';
import type { ContractDataFormat } from '../types';

export const abi: Abi = [
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
				internalType: 'address',
				name: 'receiver',
				type: 'address'
			},
			{
				internalType: 'address',
				name: 'token',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'ActiveDebt',
		type: 'error'
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'result',
				type: 'bytes32'
			}
		],
		name: 'FlashLenderCallbackFailed',
		type: 'error'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'minimumInput',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'input',
				type: 'uint256'
			}
		],
		name: 'MinimumInput',
		type: 'error'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'sender',
				type: 'address'
			},
			{
				internalType: 'address',
				name: 'owner',
				type: 'address'
			}
		],
		name: 'NotOrderOwner',
		type: 'error'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'owner',
				type: 'address'
			}
		],
		name: 'SameOwner',
		type: 'error'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'a',
				type: 'address'
			},
			{
				internalType: 'address',
				name: 'b',
				type: 'address'
			}
		],
		name: 'TokenMismatch',
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
				internalType: 'contract IExpressionDeployerV1',
				name: 'expressionDeployer',
				type: 'address'
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'handleIO',
						type: 'bool'
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
						internalType: 'struct Evaluable',
						name: 'evaluable',
						type: 'tuple'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validInputs',
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
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validOutputs',
						type: 'tuple[]'
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes'
					}
				],
				indexed: false,
				internalType: 'struct Order',
				name: 'order',
				type: 'tuple'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'orderHash',
				type: 'uint256'
			}
		],
		name: 'AddOrder',
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
						internalType: 'uint256',
						name: 'aOutput',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'bOutput',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'aInput',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'bInput',
						type: 'uint256'
					}
				],
				indexed: false,
				internalType: 'struct ClearStateChange',
				name: 'clearStateChange',
				type: 'tuple'
			}
		],
		name: 'AfterClear',
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
						internalType: 'address',
						name: 'owner',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'handleIO',
						type: 'bool'
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
						internalType: 'struct Evaluable',
						name: 'evaluable',
						type: 'tuple'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validInputs',
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
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validOutputs',
						type: 'tuple[]'
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes'
					}
				],
				indexed: false,
				internalType: 'struct Order',
				name: 'a',
				type: 'tuple'
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'handleIO',
						type: 'bool'
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
						internalType: 'struct Evaluable',
						name: 'evaluable',
						type: 'tuple'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validInputs',
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
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validOutputs',
						type: 'tuple[]'
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes'
					}
				],
				indexed: false,
				internalType: 'struct Order',
				name: 'b',
				type: 'tuple'
			},
			{
				components: [
					{
						internalType: 'uint256',
						name: 'aInputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'aOutputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'bInputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'bOutputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'aBountyVaultId',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'bBountyVaultId',
						type: 'uint256'
					}
				],
				indexed: false,
				internalType: 'struct ClearConfig',
				name: 'clearConfig',
				type: 'tuple'
			}
		],
		name: 'Clear',
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
						internalType: 'address',
						name: 'token',
						type: 'address'
					},
					{
						internalType: 'uint256',
						name: 'vaultId',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256'
					}
				],
				indexed: false,
				internalType: 'struct DepositConfig',
				name: 'config',
				type: 'tuple'
			}
		],
		name: 'Deposit',
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
				name: 'owner',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'orderHash',
				type: 'uint256'
			}
		],
		name: 'OrderExceedsMaxRatio',
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
				internalType: 'address',
				name: 'owner',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'orderHash',
				type: 'uint256'
			}
		],
		name: 'OrderNotFound',
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
				internalType: 'address',
				name: 'owner',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'orderHash',
				type: 'uint256'
			}
		],
		name: 'OrderZeroAmount',
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
						internalType: 'address',
						name: 'owner',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'handleIO',
						type: 'bool'
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
						internalType: 'struct Evaluable',
						name: 'evaluable',
						type: 'tuple'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validInputs',
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
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validOutputs',
						type: 'tuple[]'
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes'
					}
				],
				indexed: false,
				internalType: 'struct Order',
				name: 'order',
				type: 'tuple'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'orderHash',
				type: 'uint256'
			}
		],
		name: 'RemoveOrder',
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
						components: [
							{
								internalType: 'address',
								name: 'owner',
								type: 'address'
							},
							{
								internalType: 'bool',
								name: 'handleIO',
								type: 'bool'
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
								internalType: 'struct Evaluable',
								name: 'evaluable',
								type: 'tuple'
							},
							{
								components: [
									{
										internalType: 'address',
										name: 'token',
										type: 'address'
									},
									{
										internalType: 'uint8',
										name: 'decimals',
										type: 'uint8'
									},
									{
										internalType: 'uint256',
										name: 'vaultId',
										type: 'uint256'
									}
								],
								internalType: 'struct IO[]',
								name: 'validInputs',
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
										internalType: 'uint8',
										name: 'decimals',
										type: 'uint8'
									},
									{
										internalType: 'uint256',
										name: 'vaultId',
										type: 'uint256'
									}
								],
								internalType: 'struct IO[]',
								name: 'validOutputs',
								type: 'tuple[]'
							},
							{
								internalType: 'bytes',
								name: 'data',
								type: 'bytes'
							}
						],
						internalType: 'struct Order',
						name: 'order',
						type: 'tuple'
					},
					{
						internalType: 'uint256',
						name: 'inputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'outputIOIndex',
						type: 'uint256'
					}
				],
				indexed: false,
				internalType: 'struct TakeOrderConfig',
				name: 'config',
				type: 'tuple'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'input',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'output',
				type: 'uint256'
			}
		],
		name: 'TakeOrder',
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
						internalType: 'address',
						name: 'token',
						type: 'address'
					},
					{
						internalType: 'uint256',
						name: 'vaultId',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256'
					}
				],
				indexed: false,
				internalType: 'struct WithdrawConfig',
				name: 'config',
				type: 'tuple'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256'
			}
		],
		name: 'Withdraw',
		type: 'event'
	},
	{
		inputs: [
			{
				components: [
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validInputs',
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
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validOutputs',
						type: 'tuple[]'
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
						internalType: 'struct EvaluableConfig',
						name: 'evaluableConfig',
						type: 'tuple'
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes'
					}
				],
				internalType: 'struct OrderConfig',
				name: 'config_',
				type: 'tuple'
			}
		],
		name: 'addOrder',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'handleIO',
						type: 'bool'
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
						internalType: 'struct Evaluable',
						name: 'evaluable',
						type: 'tuple'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validInputs',
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
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validOutputs',
						type: 'tuple[]'
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes'
					}
				],
				internalType: 'struct Order',
				name: 'a_',
				type: 'tuple'
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'handleIO',
						type: 'bool'
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
						internalType: 'struct Evaluable',
						name: 'evaluable',
						type: 'tuple'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validInputs',
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
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validOutputs',
						type: 'tuple[]'
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes'
					}
				],
				internalType: 'struct Order',
				name: 'b_',
				type: 'tuple'
			},
			{
				components: [
					{
						internalType: 'uint256',
						name: 'aInputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'aOutputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'bInputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'bOutputIOIndex',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'aBountyVaultId',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'bBountyVaultId',
						type: 'uint256'
					}
				],
				internalType: 'struct ClearConfig',
				name: 'clearConfig_',
				type: 'tuple'
			}
		],
		name: 'clear',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'token',
						type: 'address'
					},
					{
						internalType: 'uint256',
						name: 'vaultId',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256'
					}
				],
				internalType: 'struct DepositConfig',
				name: 'config_',
				type: 'tuple'
			}
		],
		name: 'deposit',
		outputs: [],
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
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		name: 'flashFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'pure',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'contract IERC3156FlashBorrower',
				name: 'receiver_',
				type: 'address'
			},
			{
				internalType: 'address',
				name: 'token_',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: 'amount_',
				type: 'uint256'
			},
			{
				internalType: 'bytes',
				name: 'data_',
				type: 'bytes'
			}
		],
		name: 'flashLoan',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token_',
				type: 'address'
			}
		],
		name: 'maxFlashLoan',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
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
				components: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address'
					},
					{
						internalType: 'bool',
						name: 'handleIO',
						type: 'bool'
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
						internalType: 'struct Evaluable',
						name: 'evaluable',
						type: 'tuple'
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address'
							},
							{
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validInputs',
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
								internalType: 'uint8',
								name: 'decimals',
								type: 'uint8'
							},
							{
								internalType: 'uint256',
								name: 'vaultId',
								type: 'uint256'
							}
						],
						internalType: 'struct IO[]',
						name: 'validOutputs',
						type: 'tuple[]'
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes'
					}
				],
				internalType: 'struct Order',
				name: 'order_',
				type: 'tuple'
			}
		],
		name: 'removeOrder',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'output',
						type: 'address'
					},
					{
						internalType: 'address',
						name: 'input',
						type: 'address'
					},
					{
						internalType: 'uint256',
						name: 'minimumInput',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'maximumInput',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'maximumIORatio',
						type: 'uint256'
					},
					{
						components: [
							{
								components: [
									{
										internalType: 'address',
										name: 'owner',
										type: 'address'
									},
									{
										internalType: 'bool',
										name: 'handleIO',
										type: 'bool'
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
										internalType: 'struct Evaluable',
										name: 'evaluable',
										type: 'tuple'
									},
									{
										components: [
											{
												internalType: 'address',
												name: 'token',
												type: 'address'
											},
											{
												internalType: 'uint8',
												name: 'decimals',
												type: 'uint8'
											},
											{
												internalType: 'uint256',
												name: 'vaultId',
												type: 'uint256'
											}
										],
										internalType: 'struct IO[]',
										name: 'validInputs',
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
												internalType: 'uint8',
												name: 'decimals',
												type: 'uint8'
											},
											{
												internalType: 'uint256',
												name: 'vaultId',
												type: 'uint256'
											}
										],
										internalType: 'struct IO[]',
										name: 'validOutputs',
										type: 'tuple[]'
									},
									{
										internalType: 'bytes',
										name: 'data',
										type: 'bytes'
									}
								],
								internalType: 'struct Order',
								name: 'order',
								type: 'tuple'
							},
							{
								internalType: 'uint256',
								name: 'inputIOIndex',
								type: 'uint256'
							},
							{
								internalType: 'uint256',
								name: 'outputIOIndex',
								type: 'uint256'
							}
						],
						internalType: 'struct TakeOrderConfig[]',
						name: 'orders',
						type: 'tuple[]'
					}
				],
				internalType: 'struct TakeOrdersConfig',
				name: 'takeOrders_',
				type: 'tuple'
			}
		],
		name: 'takeOrders',
		outputs: [
			{
				internalType: 'uint256',
				name: 'totalInput_',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'totalOutput_',
				type: 'uint256'
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
			}
		],
		name: 'vaultBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'token',
						type: 'address'
					},
					{
						internalType: 'uint256',
						name: 'vaultId',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256'
					}
				],
				internalType: 'struct WithdrawConfig',
				name: 'config_',
				type: 'tuple'
			}
		],
		name: 'withdraw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
];

const Orderbook: ContractDataFormat = {
	abi,
	type: 'contract'
};

export default Orderbook;
