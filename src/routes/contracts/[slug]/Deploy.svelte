<script lang="ts">
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';
	import { Button, InputDropdown, Modal, Ring, Select } from '@rainprotocol/rain-svelte-components';
	import {
		type DISpair,
		getRainNetworkForChainId,
		getDeployTxData
	} from '@rainprotocol/cross-deploy';
	import { chainId, connected, provider, signer } from 'svelte-ethers-store';
	import { changeNetwork } from '$lib/connect-wallet';
	import { Subgraphs, getBlockExplorerUrl, getContractUrl, networkOptions } from '$lib/utils';
	import { supabaseClient } from '$lib/supabaseClient';
	import type { Item } from '@rainprotocol/rain-svelte-components/dist/input-dropdown/InputDropdown.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CheckCircle, ExclamationTriangle } from '@steeze-ui/heroicons';

	import type { TransactionReceipt } from '@ethersproject/abstract-provider';
	import {
		getKnownContractAddressesForChain,
		getNameFromChainId,
		getCommonChains
	} from '$lib/contracts';

	export let contractAddresses: ContractAddressRow[],
		deployerAddresses: DeployerAddressesRow[],
		metadata: any;

	let originChain: number;
	let selectedContractAddress: string;
	let selectedContractItem: Item;
	let dispairOrigin: DISpair;

	// Selected chain (provider to deploy)
	let targetChain: number;
	let oldChain = -1;
	let selectedDeployerAddress: any;
	let selectedDeployerItem: Item;
	let dispairTarget: DISpair;

	// Handle send transaction
	let txReceipt: TransactionReceipt | undefined;
	let txHash_: string;
	let openWaitTx = false;
	let waitTxResp = false;
	let waitTxReceipt = false;
	let showTxReceipt = false;
	let urlExplorer: string;

	// Error tx info
	let errorTx = false;
	let errorMsg: string;

	$: subgraphInfoOrigin = Subgraphs.find((sg_) => sg_.chain == originChain);
	$: subgraphInfoTarget = Subgraphs.find((sg_) => sg_.chain == targetChain);

	const getContractChains = (contractAddresses: ContractAddressRow[]): number[] => {
		// will only include unique chains for the contract
		const chains: Set<number> = new Set();
		contractAddresses.forEach((el) => {
			chains.add(el.chain_id);
		});
		return Array.from(chains.values());
	};

	const changeOriginChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;
	};

	const changeTargetChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;

		if ($chainId != chainIdSelected) {
			const resp = await changeNetwork(chainIdSelected);
			if (!resp.success) {
				targetChain = oldChain;
			} else {
				// Reset current target selected
				selectedDeployerAddress = null;
				selectedDeployerItem = { label: null, value: null };
				oldChain = targetChain;
			}
		}
	};

	const getContractInfo = async (address_: string) => {
		if (!address_ || !originChain || originChain == -1) return;

		const { data: dataDb, error: errorDb } = await supabaseClient
			.from('contract_addresses_new')
			.select(
				'deployer:initial_deployer(address, interpreter_address(address), store_address(address))'
			)
			.eq('address', address_)
			.single();

		if (errorDb) {
			throw new Error(`Errow when fetching from DB: ${errorDb.message}`);
		}

		dispairOrigin = {
			deployer: dataDb?.deployer.address,
			interpreter: dataDb?.deployer.interpreter_address.address,
			store: dataDb?.deployer.store_address.address
		};
	};

	const filterDeployers = (chain_: number): Item[] => {
		const deployers_ = deployerAddresses.filter((address) => chain_ == address.chain_id);

		return deployers_.map((deployer_) => {
			return {
				label: deployer_.address,
				value: deployer_.address
			};
		});
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

		dispairTarget = {
			deployer: dataDb.address,
			interpreter: dataDb.interpreter_address?.address,
			store: dataDb.store_address?.address
		};
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

		const DISInstances = {
			from: fromDIS,
			to: toDIS
		};

		// const txData = await getContractDeployTxData(network, fromDIS, toDIS, selectedContractAddress);

		const txData = await getDeployTxData(network, selectedContractAddress, {
			DIS: DISInstances
		});

		try {
			if (!txData) {
				throw new Error('It cannot retrieve the contract information');
			}

			tx_ = await $signer.sendTransaction({ data: txData });
			// Do not wait anymore
			waitTxResp = false;
			txHash_ = tx_.hash;
			waitTxReceipt = true;

			urlExplorer = getBlockExplorerUrl($chainId);

			txReceipt = await tx_.wait();

			waitTxReceipt = false;
			showTxReceipt = true;
		} catch (error) {
			// Do not wait anymore
			waitTxResp = false;
			if (error.code == 'ACTION_REJECTED') {
				// The user rejected the transaction
				errorMsg = 'Transaction rejected or cancelled';
			} else {
				// Other error
				if (error.reason) {
					errorMsg = error.reason;
				} else if (error.message) {
					errorMsg = error.message;
				} else {
					errorMsg = JSON.stringify(error);
				}
			}
			console.log(JSON.stringify(error));
			errorTx = true;
		}
	};

	$: contractChains = getContractChains(contractAddresses);
	$: knownAddressesForThisChain = getKnownContractAddressesForChain(
		contractAddresses,
		originChain,
		{ onlyContracts: true }
	);
	$: availableAddresses = knownAddressesForThisChain.length ? true : false;

	$: selectedContractAddress, getContractInfo(selectedContractAddress);
	$: selectedDeployerAddress, targetChain, getDeployerInfo(selectedDeployerAddress, targetChain);
</script>

{#if !$signer}
	<div class="flex w-1/2 flex-col gap-y-4">
		<p>You should connect your wallet before interacting with the newtork</p>
		<ConnectWallet />
	</div>
{:else}
	<div class="flex w-1/2 flex-col gap-y-6">
		<div class="flex flex-col gap-y-4">
			<span>Select an origin chain:</span>
			<Select
				items={contractChains.map((chainId_) => ({
					label: getNameFromChainId(chainId_),
					value: chainId_
				}))}
				on:change={changeOriginChain}
				bind:value={originChain}
			/>
		</div>

		{#if availableAddresses}
			<div class="flex flex-col gap-y-4">
				<span>Select a contract address:</span>
				<InputDropdown
					disabled={originChain == -1}
					bind:value={selectedContractAddress}
					bind:selectedItem={selectedContractItem}
					items={knownAddressesForThisChain}
					placeholder="Select or paste an address"
					classInput="bg-neutral-100 text-neutral-600 border border-neutral-100 bg-white rounded-md py-1 pl-2 disabled:cursor-not-allowed"
					classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md shadow cursor-default"
				/>
			</div>
		{/if}

		{#if selectedContractAddress && selectedContractAddress != ''}
			<div class="flex flex-col gap-y-4">
				<span>Select a target chain:</span>
				<Select items={networkOptions} on:change={changeTargetChain} bind:value={targetChain} />
			</div>
			{#if targetChain && targetChain != -1 && originChain != targetChain}
				<div class="flex flex-col gap-y-4">
					<span>Select a deployer address on target network:</span>

					{#key targetChain}
						<InputDropdown
							disabled={targetChain == -1}
							bind:value={selectedDeployerAddress}
							bind:selectedItem={selectedDeployerItem}
							items={filterDeployers(targetChain)}
							placeholder="Select a deployer address"
							classInput="bg-neutral-100 text-neutral-600 border border-neutral-100 bg-white rounded-md py-1 pl-2 disabled:cursor-not-allowed"
							classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md shadow cursor-default"
						/>
					{/key}
					<span class="mt-[-4px] text-sm text-yellow-600"
						>This deployer will be used only for registering the new contract. It doesn't matter
						which one you choose.</span
					>
					{#if !subgraphInfoTarget}
						<span class="text-sm text-red-600"
							>'There is no Subgraph url available for that network yet</span
						>
					{/if}
				</div>
			{/if}
		{/if}

		<div class="self-center">
			<Button
				disabled={!targetChain ||
					targetChain == -1 ||
					!subgraphInfoTarget ||
					(originChain != targetChain &&
						(!selectedDeployerAddress || selectedDeployerAddress == -1))}
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
	<!-- <div class="flex w-full flex-col gap-5">
		<div class="flex w-fit flex-col items-center gap-2.5">
			{#if icon != undefined}
				<Icon
					src={icon}
					theme={solidIcon ? 'solid' : ''}
					class={`mr-1.5 h-16 w-16 py-0.5 ${iconColor}`}
				/>
			{/if}
			<p class={`text-[${textSize}]`}>{message}</p>
		</div>
		<div class="flex justify-center">
			<Button variant="primary" on:click={() => (open = false)}>Continue</Button>
		</div>
	</div> -->
</Modal>
