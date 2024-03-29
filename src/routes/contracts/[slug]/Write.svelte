<script lang="ts">
	import ModalIDE from './../../../lib/full-ide/ModalIDE.svelte';
	import { page } from '$app/stores';
	import { Button, Select, Modal } from '@rainprotocol/rain-svelte-components';
	import { AutoAbiFormSeparated } from '@rainprotocol/rain-svelte-components';
	import { chainId, connected } from 'svelte-wagmi';
	import { writeContract, waitForTransaction, type WaitForTransactionResult } from '@wagmi/core';
	import { isAddress } from 'viem';
	import { prepareWriteFunction } from '$lib/contracts/contract-interactions';
	import SaveExpression, { type PresaveExpression } from '$lib/expressions/SaveExpression.svelte';
	import LoadExpressionModal from '$lib/expressions/LoadExpressionModal.svelte';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { fade } from 'svelte/transition';
	import type { Abi, AbiFunction } from 'abitype';
	import { getWriteMethods } from './write';
	import type {
		ContractAddressRow,
		ContractRowFull,
		DeployerAddressesRow,
		ExpressionRowFull
	} from '$lib/types/types';
	import HelpPanel from '$lib/HelpPanel.svelte';
	import AuthInner from '$lib/AuthInner.svelte';
	import { setContext } from 'svelte';
	import { changeNetwork } from '$lib/connect-wallet';

	import { InputDropdown } from '@rainprotocol/rain-svelte-components';
	import { getKnownContractAddressesForChain, getCommonChains } from '$lib/contracts';
	import { getChainName } from '$lib/utils';

	export let metadata: any,
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
	let selectedInterpreter: string | -1; // the selected contract address

	let openHelpModal: boolean = false;

	let transactionError: any;

	// Variable used to save old chain selected in case the change chain fail
	let oldChain = -1;

	$: availableChains = getCommonChains(deployerAddresses, contractAddresses);
	$: writeMethods = getWriteMethods(abi);
	$: knownAddressesForThisChain = getKnownContractAddressesForChain(
		contractAddresses,
		selectedChain
		// TODO: It cannot use only proxies since some contracts like OB is not intended
		// to be cloned, but other contracts like Flow are. So, here is needed an strategy
		// to only show proxies on those cases were the contracts are initializable.
		// { onlyProxies: true }
	);

	// To only show the column to write expressions
	// TODO: Until have eval onchain. Maybe add some button to turn on/off the eval column
	setContext('onlyExpressionParser', true);

	setContext('EVALUABLE_ADDRESSES', {
		getDeployers: async () => {
			return deployerAddresses.filter((address) => selectedChain == address.chain_id);
		}
	});

	// submit the transaction
	const submit = async () => {
		if (selectedContract === -1) {
			transactionError = 'No contract has been selected to interact';
			return;
		}

		if (!isAddress(selectedContract)) {
			transactionError = `Not a valid hex contract address: ${selectedContract}`;
			return;
		}

		// isAddress()
		if (selectedMethod === -1) {
			transactionError = 'No method selected';
			return;
		}

		try {
			const requestWrite = await prepareWriteFunction(
				selectedContract,
				abi,
				selectedMethod.name,
				result
			);

			const { hash } = await writeContract(requestWrite);
			// TODO: Add TX modal to see result
			await waitForTransaction({ hash });
		} catch (error) {
			transactionError = error;
			console.log(error);
		}
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

	const changeChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;

		if ($chainId?.toString() != chainIdSelected) {
			const resp = await changeNetwork(chainIdSelected);
			if (!resp.success) {
				selectedChain = oldChain;
			} else {
				// Reset current contract selected
				selectedContract = -1;
				oldChain = selectedChain;
			}
		}
	};

	$: connectedChainName = getChainName($chainId);

	let items: any;
	let selectedDeployer: any;
	let selectedItem: any;
</script>

<!-- TODO: For some reason when importing and using the components fix the issue. Search deeply the reason -->
<div hidden>
	<InputDropdown
		bind:value={selectedDeployer}
		bind:selectedItem
		{items}
		placeholder="Select interpreter"
		classInput="text-neutral-600 border border-neutral-100 bg-white rounded-md px-0 py-1 text-xs w-full pl-2"
		classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md text-xs shadow cursor-default font-mono"
	/>
</div>

<div class="flex flex-col gap-y-4">
	<span>Select a chain</span>
	<Select
		items={availableChains.map((chainId_) => ({
			label: getChainName(chainId_),
			value: chainId_
		}))}
		on:change={changeChain}
		bind:value={selectedChain}
	/>
	{#if selectedChain && selectedChain !== -1}
		{#if knownAddressesForThisChain.length == 0}
			<span class="text-yellow-600">No known deployments for this chain.</span>
		{/if}

		<span>Select a method to write</span>
		<Select items={writeMethods} bind:value={selectedMethod} />
	{/if}
</div>

{#key selectedChain}
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
					{#if !$connected}
						<div class="self-center">
							<ConnectWallet />
						</div>
					{:else}
						<div class="flex items-center gap-x-2">
							<div class="h-3 w-3 rounded-full bg-green-600" />
							<span>Connected to {connectedChainName}</span>
						</div>
						<div class="flex flex-col gap-y-2">
							{#if knownAddressesForThisChain.length}
								<span>Select from known addresses for this contract on {connectedChainName}</span>
								<Select items={knownAddressesForThisChain} bind:value={selectedContract} />
							{:else}
								<span class="text-gray-500">No known deployments for this chain.</span>
							{/if}
						</div>
						<div class="self-start">
							<Button disabled={selectedContract == -1} on:click={submit} variant="primary"
								>Submit</Button
							>
						</div>
						{#if transactionError}
							<p class="font-regular break-words p-2 text-sm text-red-500">
								{transactionError}
							</p>
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	{/key}
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
