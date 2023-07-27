<script lang="ts">
	import type { Abi } from 'abitype';
	import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';
	import { allChainsData, chainId, signer, defaultEvmStores, contracts } from 'svelte-ethers-store';
	import { setContext } from 'svelte';
	import {
		Button,
		InitializeForm,
		Select,
		Modal,
		Ring,
		InitFormUtils
	} from '@rainprotocol/rain-svelte-components';
	import {
		getCommonChainsInAddresses,
		getKnownContractAddressesForChain,
		CloneFactoryAbi
	} from '$lib/contracts';
	import { changeNetwork } from '$lib/connect-wallet';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { CheckCircle, ExclamationTriangle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { getChainName, getNetworkByChainId } from '$lib/utils';
	import type { ContractReceipt } from 'ethers';

	export let abi: Abi;
	export let contract_meta: any;
	export let contractAddresses: ContractAddressRow[];
	export let deployerAddresses: DeployerAddressesRow[];
	export let cloneFactories: { id: string; address: string; chain_id: number }[] = [];

	let selectedChain: number;
	// Variable used to save old chain selected in case the change chain fail
	let oldChain = -1;
	let result: any[];
	let isInitializable: boolean;
	let selectedCloneFactory: string | -1; // the selected implementation address
	let selectedImplementation: string | -1; // the selected contract address

	// Handle send transaction
	let txReceipt: ContractReceipt | undefined;
	let txHash_: string;
	let openWaitTx = false;
	let waitTxResp = false;
	let waitTxReceipt = false;
	let showTxReceipt = false;
	let urlExplorer: string;
	let proxyCloneAddress: string; //THis is for showing the proxy address

	// Error tx info
	let errorTx = false;
	let errorMsg: string;

	setContext('EVALUABLE_ADDRESSES', {
		getDeployers: async () => {
			return deployerAddresses.filter((address) => selectedChain == address.chain_id);
		}
	});

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

	const changeChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;

		if ($chainId != chainIdSelected) {
			const resp = await changeNetwork(chainIdSelected);
			if (!resp.success) {
				selectedChain = oldChain;
			} else {
				// Reset current contract implementation selected
				selectedCloneFactory = -1;
				selectedImplementation = -1;
				oldChain = selectedChain;
			}
		}
	};

	const findProxyAddress = (txReceipt_: ContractReceipt) => {
		const contract = $contracts.selectedCloneFactory;

		const eventObj = txReceipt_.events?.find((x) => {
			if (
				x.topics[0] == contract.filters['NewClone']().topics?.[0] &&
				x.address.toLowerCase() == contract.address.toLowerCase()
			) {
				return true;
			}
		});

		if (!eventObj) {
			throw new Error(
				`Could not find event 'NewClone' event on the tx  ${txReceipt_.transactionHash}`
			);
		}

		const decodedEvent = contract.interface.decodeEventLog(
			'NewClone',
			eventObj.data,
			eventObj.topics
		);

		const { clone } = decodedEvent;

		return clone;
	};

	// submit the transaction
	const submit = async () => {
		openWaitTx = true;
		waitTxResp = true;

		// handling error cases
		try {
			// creating an ethers contract instance with the selected known address
			if (typeof selectedCloneFactory != 'string') {
				throw new Error('Not clone factory address selected');
			}

			defaultEvmStores.attachContract(
				'selectedCloneFactory',
				selectedCloneFactory,
				JSON.stringify(CloneFactoryAbi)
			);

			// Encode based on the config
			const encodedConfig = InitFormUtils.encodeConfigs(result, abi, contract_meta);

			// Send to the clonable
			let tx_ = await $contracts.selectedCloneFactory.clone(selectedImplementation, encodedConfig);

			// Do not wait anymore
			waitTxResp = false;
			txHash_ = tx_.hash;
			waitTxReceipt = true;

			const networkInfo = getNetworkByChainId($chainId);
			if (networkInfo && networkInfo.explorers && networkInfo.explorers.length) {
				urlExplorer = networkInfo.explorers[0].url;
			}

			txReceipt = await tx_.wait();

			if (txReceipt) {
				proxyCloneAddress = findProxyAddress(txReceipt);
			}

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
			errorTx = true;
		}
	};

	$: connectedChainName = allChainsData.find((chain) => chain.chainId == $chainId)?.name;
	$: availableChains = getCommonChainsInAddresses(deployerAddresses);
	$: knownAddressesForThisChain = getKnownContractAddressesForChain(
		contractAddresses,
		selectedChain,
		{ onlyContracts: true }
	);
	$: cloneFactoriesForThisChain = getKnownContractAddressesForChain(cloneFactories, selectedChain);
</script>

<div class="flex flex-col gap-y-4">
	<span>Select the chain to deploy the proxy</span>
	<Select
		items={availableChains.map((chainId_) => ({
			label: getChainName(chainId_),
			value: chainId_
		}))}
		on:change={changeChain}
		bind:value={selectedChain}
	/>
	{#if selectedChain && selectedChain !== -1}
		<span>Specify the configuration to create:</span>
		<InitializeForm {abi} contractMeta={contract_meta} bind:isInitializable bind:result />

		<div class="mt-8 flex flex-col gap-y-4 rounded-lg border border-gray-300 p-4">
			{#if !$signer}
				<div class="self-center">
					<ConnectWallet />
				</div>
			{:else}
				<div class="flex items-center gap-x-2">
					<div class="h-3 w-3 rounded-full bg-green-600" />
					<span>Connected to {connectedChainName}</span>
				</div>
				<div class="flex flex-col gap-y-6">
					<div>
						{#if cloneFactoriesForThisChain && cloneFactoriesForThisChain.length}
							<span
								>Select a known Clone Factory on {allChainsData.find(
									(chain) => chain.chainId == $chainId
								)?.name}</span
							>
							<Select items={cloneFactoriesForThisChain} bind:value={selectedCloneFactory} />
						{:else}
							<span class="text-gray-500">No known Clone Factories for this chain.</span>
						{/if}
					</div>

					<div>
						{#if knownAddressesForThisChain && knownAddressesForThisChain.length}
							<span
								>Select an addresses of this contract on {allChainsData.find(
									(chain) => chain.chainId == $chainId
								)?.name} to clone</span
							>
							<Select items={knownAddressesForThisChain} bind:value={selectedImplementation} />
						{:else}
							<span class="text-gray-500">No known deployments for this chain.</span>
						{/if}
					</div>
				</div>
				<div class="self-start">
					<Button
						disabled={selectedCloneFactory == -1 || selectedImplementation == -1}
						on:click={submit}
						variant="primary">Create proxy</Button
					>
				</div>
			{/if}
		</div>
	{/if}
</div>

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
					<p>Proxy created successfully</p>
					<div class="flex flex-col gap-2">
						<p>Proxy address:</p>
						<a
							class="text-blue-600"
							target="_blank"
							rel="noreferrer"
							href={`${urlExplorer}/address/${proxyCloneAddress}`}
						>
							{proxyCloneAddress}
						</a>
					</div>
				</div>
			{:else}
				<div class="flex flex-col items-center gap-1">
					<Icon
						src={ExclamationTriangle}
						theme="solid"
						class={`mr-1.5 h-16 w-16 py-0.5 text-red-500`}
					/>
					<p>Proxy creation reverted</p>
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
