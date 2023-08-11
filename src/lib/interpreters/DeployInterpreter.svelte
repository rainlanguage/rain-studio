<script lang="ts">
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import type { ContractAddressRow } from '$lib/types/types';
	import {
		Button,
		Input,
		InputDropdown,
		Modal,
		Ring,
		Select
	} from '@rainprotocol/rain-svelte-components';
	import {
		type DISpair,
		getRainNetworkForChainId,
		getDeployTxData,
		checkObtainTxHash
	} from '@rainprotocol/cross-deploy';
	import { chainId, connected } from 'svelte-wagmi';
	import {
		sendTransaction,
		prepareSendTransaction,
		waitForTransaction,
		type WaitForTransactionResult
	} from '@wagmi/core';
	import { changeNetwork } from '$lib/connect-wallet';
	import {
		Subgraphs,
		getBlockExplorerUrl,
		getChainsFromAddresses,
		getContractUrl,
		networkOptions
	} from '$lib/utils';
	import { supabaseClient } from '$lib/supabaseClient';
	import type { Item } from '@rainprotocol/rain-svelte-components/dist/input-dropdown/InputDropdown.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowTopRightOnSquare, CheckCircle, ExclamationTriangle } from '@steeze-ui/heroicons';

	import type { TransactionReceipt } from '@ethersproject/abstract-provider';
	import { getKnownContractAddressesForChain } from '$lib/contracts';
	import { interpreterName } from '$lib/interpreters';
	import { flip } from 'lodash-es';
	import { ethers } from 'ethers';

	export let interpreterAddresses: ContractAddressRow[];
	export let interpreterType: string;

	let originChain: number;
	let selectedInterpreterAddress: string;
	let selectedInterpretertItem: Item;
	let dispairOrigin: DISpair;

	// Selected chain (provider to deploy)
	let targetChain: number;
	let oldChain = -1;
	let dispairTarget: DISpair;

	// Only if it's a 'deployer' type
	let selectedRainterpreterAddress: string;
	let selectedRainterpretertItem: Item;
	let rainterpreterAddresses: Item[];
	let selectedStoreAddress: string;
	let selectedStoretItem: Item;
	let storeAddresses: Item[];

	// Handle send transaction
	let txReceipt: WaitForTransactionResult | undefined;
	let txHash_: string;
	let openWaitTx = false;
	let waitTxResp = false;
	let waitTxReceipt = false;
	let showTxReceipt = false;
	let urlExplorer: string;

	// Error tx info
	let errorTx = false;
	let errorMsg: string;

	// Check cross deploy
	// Flag if can deploy with tx hash provided by user
	let canCrossDeploy: boolean;
	let checking: boolean = false;
	// Required if `canCrossDeploy` is false
	let requiredTxhash: string;
	let isValidTxHash: boolean = false;

	$: subgraphInfoTarget = Subgraphs.find((sg_) => sg_.chain == targetChain);

	const changeOriginChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;
	};

	const changeTargetChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;

		if ($chainId?.toString() != chainIdSelected) {
			const resp = await changeNetwork(chainIdSelected);
			if (!resp.success) {
				targetChain = oldChain;
			} else {
				// Reset current target selected
				oldChain = targetChain;
			}
		}
	};

	const getDeployerInfo = async (address_: string, chainId_: number) => {
		if (!address_ || !chainId_ || chainId_ == -1) return;

		const { data: dataDb, error: errorDb } = await supabaseClient
			.from('deployers_addresses')
			.select('address, interpreter_address(address), store_address(address)')
			.eq('address', address_)
			.eq('chain_id', chainId_)
			.single();

		if (errorDb) {
			console.log(`Error when fetching from DB: ${errorDb.message}`);
			return;
		}
		if (!dataDb) {
			throw new Error(`Not data found for this address "${address_}" and chain_id "${chainId_}"`);
		}

		dispairOrigin = {
			interpreter: dataDb.interpreter_address?.address,
			store: dataDb.store_address?.address
		};
	};

	const getInterpreters = async (chainId_: number) => {
		if (!chainId_ || chainId_ == -1) return;

		const { data: dataRainterpreters, error: errorRainterpreters } = await supabaseClient
			.from('rainterpreter_addresses')
			.select('address')
			.eq('chain_id', chainId_);

		const { data: dataStores, error: errorStores } = await supabaseClient
			.from('rainterpreter_store_addresses')
			.select('address')
			.eq('chain_id', chainId_);

		if (errorRainterpreters || errorStores) {
			const _message = errorRainterpreters ? errorRainterpreters.message : errorStores?.message;

			console.log(`Error when fetching from DB: ${_message}`);
			return;
		}

		rainterpreterAddresses = dataRainterpreters.map((rainterpreter_) => {
			return { value: rainterpreter_.address, label: rainterpreter_.address };
		});
		storeAddresses = dataStores.map((store_) => {
			return { value: store_.address, label: store_.address };
		});
	};

	const assignDisInstances = (
		selectedRainterpreterAddress_: string,
		selectedStoreAddress_: string
	) => {
		// If are empties, does not assign them
		if (!selectedRainterpreterAddress_ || !selectedStoreAddress_) return;

		dispairTarget = {
			interpreter: selectedRainterpreterAddress_,
			store: selectedStoreAddress_
		};
	};

	const checkTxHash = async (hash_: string) => {
		isValidTxHash = ethers.utils.isHexString(hash_, 32);
		return isValidTxHash;
	};

	const txHashValidator = async (value_: any) => {
		if (!ethers.utils.isHexString(value_, 32)) {
			return { error: 'It is not a valid tx hash.' };
		}

		return true;
	};

	const closeModalTx = () => {
		txReceipt = undefined;
		openWaitTx = false;
		waitTxResp = false;
		waitTxReceipt = false;
		showTxReceipt = false;
		urlExplorer = '';

		errorTx = false;
		errorMsg = '';
	};

	const crossDeploy = async () => {
		openWaitTx = true;
		waitTxResp = true;

		const network = getRainNetworkForChainId(originChain);
		let tx_;

		if (network == null) {
			throw new Error('Not network valid to get data');
		}

		const fromDIS = dispairOrigin;
		const toDIS = originChain == targetChain ? dispairOrigin : dispairTarget;

		const _options: { DIS?: { from: DISpair; to: DISpair }; txHash?: string } = {};

		// If it's a deployer interpreter type, will need the DIS instnaces.
		if (interpreterType == 'deployer') {
			_options.DIS = {
				from: fromDIS,
				to: toDIS
			};
		}

		if (requiredTxhash) {
			_options.txHash = requiredTxhash;
		}

		try {
			const txData = (await getDeployTxData(
				network,
				selectedInterpreterAddress,
				_options
			)) as `0x${string}`;

			if (!txData) {
				throw new Error('It cannot retrieve the contract information');
			}

			const preparedTx = await prepareSendTransaction({ data: txData });
			tx_ = await sendTransaction(preparedTx);

			// Do not wait anymore
			waitTxResp = false;
			txHash_ = tx_.hash;
			waitTxReceipt = true;

			urlExplorer = getBlockExplorerUrl($chainId);

			txReceipt = await waitForTransaction({ hash: tx_.hash });

			waitTxReceipt = false;
			showTxReceipt = true;
		} catch (error) {
			// Do not wait anymore
			waitTxResp = false;

			// TODO: Work to found how silent the error/red lines checking the error
			// instances. That would be better, but not sure how should be made here.

			// @ts-expect-error Compile error: There is no instance definition to check
			if (error.code == 'ACTION_REJECTED') {
				// The user rejected the transaction
				errorMsg = 'Transaction rejected or cancelled';
			} else {
				// Other error
				// @ts-expect-error Compile error: There is no instance definition to check
				if (error.reason) {
					// @ts-expect-error Compile error: There is no instance definition to check
					errorMsg = error.reason;
					// @ts-expect-error Compile error: There is no instance definition to check
				} else if (error.message) {
					// @ts-expect-error Compile error: There is no instance definition to check
					errorMsg = error.message;
				} else {
					errorMsg = JSON.stringify(error);
				}
			}
			console.log(error);
			console.log(JSON.stringify(error));
			errorTx = true;
		}
	};

	const checkDeploy = async (chain_: number, address_: string) => {
		checking = true;
		const _network = getRainNetworkForChainId(chain_);
		if (!_network) {
			return false;
		}

		canCrossDeploy = await checkObtainTxHash(_network, address_);
		checking = false;
	};

	$: contractChains = getChainsFromAddresses(interpreterAddresses);

	$: knownAddressesForThisChain = getKnownContractAddressesForChain(
		interpreterAddresses,
		originChain
	);

	$: availableAddresses = knownAddressesForThisChain.length ? true : false;

	$: originChain &&
		selectedInterpreterAddress &&
		checkDeploy(originChain, selectedInterpreterAddress);

	$: interpreterType == 'deployer' && (targetChain, getInterpreters(targetChain));

	$: interpreterType == 'deployer' &&
		(originChain,
		selectedInterpreterAddress,
		getDeployerInfo(selectedInterpreterAddress, originChain));

	$: interpreterType == 'deployer' &&
		selectedRainterpreterAddress &&
		selectedRainterpreterAddress != '' &&
		selectedStoreAddress &&
		selectedStoreAddress != '' &&
		assignDisInstances(selectedRainterpreterAddress, selectedStoreAddress);

	$: requiredTxhash && checkTxHash(requiredTxhash);
</script>

{#if !$connected}
	<div class="flex w-1/2 flex-col gap-y-4">
		<p>You should connect your wallet before interacting with the newtork</p>
		<ConnectWallet />
	</div>
{:else}
	<div class="flex w-1/2 flex-col gap-y-6">
		<div class="flex flex-col gap-y-4">
			<span>Select an origin chain:</span>
			<Select
				items={contractChains.map(({ name, id }) => {
					return { label: name, value: id };
				})}
				on:change={changeOriginChain}
				bind:value={originChain}
			/>
		</div>
		{#if availableAddresses}
			<div class="flex flex-col gap-y-4">
				<span>Select {interpreterName(interpreterType, { addArticle: true })} address:</span>
				<InputDropdown
					disabled={originChain == -1}
					bind:value={selectedInterpreterAddress}
					bind:selectedItem={selectedInterpretertItem}
					items={knownAddressesForThisChain}
					placeholder="Select or paste an address"
					classInput="bg-neutral-100 text-neutral-600 border border-neutral-100 bg-white rounded-md py-1 pl-2 disabled:cursor-not-allowed"
					classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md shadow cursor-default"
				/>
				{#if selectedInterpreterAddress && selectedInterpreterAddress != '' && !checking && !canCrossDeploy}
					<p class="text-yellow-600">
						The deploy transaction hash of this address cannot be obtained automatically. Please
						provide the transaction hash.
					</p>
				{/if}
			</div>
		{/if}

		{#if checking}
			<div class="flex flex-col">
				<Ring size="40px" color="#cbd5e1" />
			</div>
		{/if}

		{#if selectedInterpreterAddress && selectedInterpreterAddress != '' && !checking && !canCrossDeploy}
			<div class="flex flex-col gap-y-4">
				<Input bind:value={requiredTxhash} validator={txHashValidator}>
					<span slot="label">Transaction hash</span>
				</Input>
				<a
					class="flex flex max-w-fit items-center items-center justify-center gap-x-1 rounded-[10px] bg-blue-500 px-2.5 py-[5px] text-sm text-white hover:bg-blue-400 hover:underline"
					target="_blank"
					rel="noreferrer"
					href={getContractUrl(selectedInterpreterAddress, originChain)}
				>
					<p>Go to contract address</p>
					<Icon src={ArrowTopRightOnSquare} class="h-4 w-4" />
				</a>
			</div>
		{/if}

		{#if selectedInterpreterAddress && selectedInterpreterAddress != '' && !checking && ((!canCrossDeploy && requiredTxhash && isValidTxHash) || canCrossDeploy)}
			<div class="flex flex-col gap-y-4">
				<span>Select a target chain:</span>
				<Select items={networkOptions} on:change={changeTargetChain} bind:value={targetChain} />
			</div>
			{#key targetChain}
				{#if targetChain && targetChain != -1 && originChain != targetChain}
					<div class="flex flex-col gap-y-4">
						{#if interpreterType === 'deployer'}
							<div class="flex flex-col gap-y-4">
								<span>Select a Rainterpreter address on target network:</span>
								<InputDropdown
									disabled={targetChain == -1}
									bind:value={selectedRainterpreterAddress}
									bind:selectedItem={selectedRainterpretertItem}
									items={rainterpreterAddresses}
									placeholder="Select a rainterpreter address"
									classInput="bg-neutral-100 text-neutral-600 border border-neutral-100 bg-white rounded-md py-1 pl-2 disabled:cursor-not-allowed"
									classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md shadow cursor-default"
								/>
							</div>
							<div class="flex flex-col gap-y-4">
								<span>Select a Store address on target network:</span>
								<InputDropdown
									disabled={targetChain == -1}
									bind:value={selectedStoreAddress}
									bind:selectedItem={selectedStoretItem}
									items={storeAddresses}
									placeholder="Select a store address"
									classInput="bg-neutral-100 text-neutral-600 border border-neutral-100 bg-white rounded-md py-1 pl-2 disabled:cursor-not-allowed"
									classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md shadow cursor-default"
								/>
							</div>
						{/if}
						{#if !subgraphInfoTarget}
							<span class="text-sm text-red-600"
								>'There is no Subgraph url available for that network yet</span
							>
						{/if}
					</div>
				{/if}
			{/key}
		{/if}

		<div class="self-center">
			<Button
				disabled={!targetChain ||
					targetChain == -1 ||
					!subgraphInfoTarget ||
					(originChain != targetChain &&
						interpreterType == 'deployer' &&
						(!selectedRainterpreterAddress ||
							selectedRainterpreterAddress == '' ||
							!selectedStoreAddress ||
							selectedStoreAddress == ''))}
				on:click={crossDeploy}>Deploy</Button
			>
		</div>
	</div>
{/if}

<Modal bind:open={openWaitTx} disableOutsideClickClose>
	<div class="flex w-full flex-col gap-5">
		{#if waitTxResp}
			<div class="flex flex-col gap-5">
				<p>Waiting for transaction...</p>
				<div class="mx-auto">
					<Ring size="40px" color="#cbd5e1" />
				</div>
			</div>
		{:else if errorTx}
			<div class="flex flex-col items-center gap-1">
				<Icon
					src={ExclamationTriangle}
					theme="solid"
					class={`mr-1.5 h-16 w-16 py-0.5 text-red-500`}
				/>
				<p>
					{errorMsg}
				</p>
			</div>
		{:else if waitTxReceipt}
			<div class="flex flex-col gap-5">
				<p>Waiting for the transaction to be mined...</p>
				<div class="flex flex-col gap-2">
					<p>See the status:</p>
					<a
						class="text-blue-600"
						target="_blank"
						rel="noreferrer"
						href={`${urlExplorer}/tx/${txHash_}`}
					>
						{txHash_}
					</a>
				</div>
				<div class="mx-auto">
					<Ring size="40px" color="#cbd5e1" />
				</div>
			</div>
		{:else if showTxReceipt}
			{#if txReceipt?.status}
				<div class="flex flex-col items-center gap-1">
					<Icon src={CheckCircle} theme="solid" class={`mr-1.5 h-16 w-16 py-0.5 text-green-500`} />
					<p>Contract created successfully</p>
					<a
						class="text-blue-600"
						target="_blank"
						rel="noreferrer"
						href={getContractUrl(txReceipt.contractAddress, targetChain)}
					>
						{txReceipt.contractAddress}
					</a>
				</div>
			{:else}
				<div class="flex flex-col items-center gap-1">
					<Icon
						src={ExclamationTriangle}
						theme="solid"
						class={`mr-1.5 h-16 w-16 py-0.5 text-red-500`}
					/>
					<p>Contract creation reverted</p>
				</div>
			{/if}
			<div class="flex flex-col gap-2">
				<p>Transaction result:</p>
				<a
					class="text-blue-600"
					target="_blank"
					rel="noreferrer"
					href={`${urlExplorer}/tx/${txHash_}`}
				>
					{txHash_}
				</a>
			</div>
		{/if}

		<div class="flex justify-center">
			<Button variant="primary" on:click={closeModalTx}>Close</Button>
		</div>
	</div>
</Modal>
