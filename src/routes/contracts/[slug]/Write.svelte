<script lang="ts">
	import ModalIDE from './../../../lib/full-ide/ModalIDE.svelte';
	import { page } from '$app/stores';
	import { Button, Select, Modal } from '@rainprotocol/rain-svelte-components';
	import AutoAbiFormSeparated from '@rainprotocol/rain-svelte-components/auto-abi-form/AutoAbiFormSeparated.svelte';
	import type { ContractMetadata } from 'rain-metadata/type-definitions/contract';
	import { ethers } from 'ethers';
	import { chainId, defaultEvmStores, contracts, signer, allChainsData } from 'svelte-ethers-store';
	import SaveExpression, { type PresaveExpression } from '$lib/expressions/SaveExpression.svelte';
	import LoadExpressionModal from '$lib/expressions/LoadExpressionModal.svelte';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { fade } from 'svelte/transition';
	import type { Abi, AbiFunction } from 'abitype';
	import {
		getCommonChains,
		getKnownContractAddressesForChain,
		getNameFromChainId,
		getWriteMethods
	} from './write';
	import type {
		ContractAddressRow,
		ContractRowFull,
		DeployerAddressesRow,
		ExpressionRowFull
	} from '$lib/types/types';
	import HelpPanel from '$lib/HelpPanel.svelte';
	import AuthInner from '$lib/AuthInner.svelte';
	import { setContext } from 'svelte';

	export let metadata: ContractMetadata,
		abi: Abi,
		contract: ContractRowFull,
		contractAddresses: ContractAddressRow[],
		deployerAddresses: DeployerAddressesRow[];

	let result: any = []; // the state of the the form

	let selectedMethod: { name: string; def: AbiFunction } | -1; // the selected method
	let selectedChain: number;
	let selectedContract: string | -1; // the selected contract address

	let openNewExpModal: boolean = false;
	let presaveExpression: PresaveExpression;
	let expressionToSave: string;

	let openIDEModal: boolean = false;
	let expressionForIDE: ExpressionRowFull;

	let loadExpressionModal: boolean = false;
	let loadRaw: Function;
	let expressionComponentName: string;

	let openHelpModal: boolean = false;

	$: availableChains = getCommonChains(deployerAddresses, contractAddresses);
	$: writeMethods = getWriteMethods(abi);

	setContext('EVALUABLE_ADDRESSES', {
		getDeployers: async () => {
			return deployerAddresses.filter((address) => selectedChain == address.chainId);
		}
	});

	// submit the transaction
	const submit = async () => {
		// creating an ethers contract instance with the selected known address
		if (typeof selectedContract == 'string' && ethers.utils.isAddress(selectedContract))
			defaultEvmStores.attachContract(
				'selectedContract',
				selectedContract,
				abi as unknown as string
			);

		// handling error cases
		if (selectedMethod == -1) throw Error('No method selected');

		await $contracts.selectedContract[selectedMethod.name](...result);
	};

	const saveExpression = async ({ detail: { raw } }: { detail: { raw: string } }) => {
		if (selectedInterpreter == -1) throw Error('No interpreter selected');
		presaveExpression = {
			raw_expression: raw,
			contract,
			interpreter: selectedInterpreter?.interpreter
		};
		expressionToSave = raw;
		openNewExpModal = true;
	};

	const loadExpression = async ({ detail }: { detail: any }) => {
		loadRaw = detail.loadRaw;
		expressionComponentName = detail.componentName;
		loadExpressionModal = true;
	};

	const loadSelectedExpression = async ({ detail }: { detail: any }) => {
		loadExpressionModal = false;
		loadRaw(detail.expression.raw_expression);
	};

	const expandExpression = async ({ detail }: { detail: any }) => {
		expressionForIDE = {
			id: '',
			contract_expression: detail.componentName,
			contract: contract,
			raw_expression: detail.raw
		};
		loadRaw = detail.loadRaw;
		openIDEModal = true;
	};

	const handleHelp = () => {
		openHelpModal = true;
	};

	$: connectedChainName = allChainsData.find((chain) => chain.chainId == $chainId)?.name;
</script>

<div class="flex flex-col gap-y-4">
	<span>Select a chain</span>
	<Select
		items={availableChains.map((chainId) => ({
			label: getNameFromChainId(chainId),
			value: chainId
		}))}
		bind:value={selectedChain}
	/>
	{#if selectedChain && selectedChain !== -1}
		<span>Select a method to write</span>
		<Select items={writeMethods} bind:value={selectedMethod} />
	{/if}
</div>
{#key selectedMethod}
	{#if selectedMethod && selectedMethod !== -1}
		<div in:fade class="mb-12">
			{#key selectedMethod}
				<AutoAbiFormSeparated
					{abi}
					{metadata}
					methodName={selectedMethod.name}
					bind:result
					on:save={saveExpression}
					on:load={loadExpression}
					on:expand={expandExpression}
					on:help={handleHelp}
					showInterpreterFields={false}
				/>
			{/key}
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
					<div class="flex flex-col gap-y-2">
						{#if getKnownContractAddressesForChain(contractAddresses, selectedChain)?.length}
							<span
								>Select from known addresses for this contract on {allChainsData.find(
									(chain) => chain.chainId == $chainId
								)?.name}</span
							>
							<Select
								items={getKnownContractAddressesForChain(contractAddresses, selectedChain)}
								bind:value={selectedContract}
							/>
						{:else}
							<span class="text-gray-500">No known deployments for this chain.</span>
						{/if}
					</div>
					<div class="self-start">
						<Button disabled={selectedContract == -1} on:click={submit} variant="primary"
							>Submit</Button
						>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/key}

<Modal bind:open={openNewExpModal}>
	{#if $page.data.session}
		<SaveExpression {presaveExpression} />
	{:else}
		<AuthInner />
	{/if}
</Modal>

<Modal bind:open={openHelpModal}>
	<HelpPanel />
</Modal>

<Modal bind:open={loadExpressionModal}>
	{#if $page.data.session}
		<LoadExpressionModal on:select={loadSelectedExpression} {contract} {expressionComponentName} />
	{:else}
		<AuthInner />
	{/if}
</Modal>

<ModalIDE bind:open={openIDEModal} expression={expressionForIDE} {loadRaw} />
