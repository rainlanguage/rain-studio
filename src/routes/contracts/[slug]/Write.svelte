<script lang="ts">
	import { page } from '$app/stores';
	import { Button, Select, Modal } from 'rain-svelte-components/package';
	import AutoAbiFormSeparated from 'rain-svelte-components/package/auto-abi-form/AutoAbiFormSeparated.svelte';
	import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
	import { ethers, logger } from 'ethers';
	import { chainId, defaultEvmStores, contracts, signer, allChainsData } from 'svelte-ethers-store';
	import SaveExpression, { type PresaveExpression } from '$lib/expressions/SaveExpression.svelte';
	import Auth from '$lib/Auth.svelte';
	import LoadExpressionModal from '$lib/expressions/LoadExpressionModal.svelte';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { fade } from 'svelte/transition';
	import type { InterpreterRowFull } from '$lib/types/types';
	import { get, set } from 'lodash-es';

	export let metadata: ContractMetadata, abi: any, contract: any;

	let methodName: string | number; // the selected method
	let result: any = []; // the state of the the form
	let selectedChain: number;
	let selectedInterpreter: { id: string; interpreter: string; deployer: string } | -1;
	let contractAddress: string | -1; // the selected contract address

	let openNewExpModal: boolean = false,
		loadExpressionModal: boolean = false;
	let expressionToSave: string;
	let presaveExpression: PresaveExpression;

	let loadRaw: Function;

	// getting all of the state changing methods for this abi
	$: writeMethods = abi.abi
		.filter(
			(def: any) =>
				def.type == 'function' &&
				def.inputs.length &&
				def.name !== 'createChild' &&
				def.stateMutability !== 'view'
		)
		.map((def: any) => ({ label: def.name, value: def.name }));

	// filtering to the known addresses for the connected chain
	$: knownAddresses = metadata.addresses
		.filter((chain) => chain.chainId == $chainId)[0]
		?.knownAddresses.map((address) => {
			return { label: address, value: address };
		});

	const getNameFromChainId = (id: number): string => {
		const name = allChainsData.find((chain) => chain.chainId == id)?.name;
		if (!name) throw Error('Unknown chainId');
		return name;
	};

	// getting the chains for which there's both a known address for contract and interpreter
	const getCommonChains = (
		interpreters: InterpreterRowFull[],
		metadata: ContractMetadata
	): number[] => {
		// will only include unique chains
		const chains: Set<number> = new Set();
		interpreters.forEach((interpreter) => {
			interpreter.metadata.addresses.forEach((address) => {
				chains.add(address.chainId);
			});
		});
		metadata.addresses.forEach((address) => {
			chains.add(address.chainId);
		});
		return Array.from(chains.values());
	};

	const getInterpretersForChain = (
		interpreters: InterpreterRowFull[],
		chainId: number
	): { label: string; value: { interpreter: string; deployer: string } }[] => {
		let interpretersForSelect: {
			label: string;
			value: { id: string; interpreter: string; deployer: string };
		}[] = [];
		interpreters.forEach((interpreter) => {
			interpreter.metadata.addresses.forEach((address) => {
				if (address.chainId == chainId) {
					address.knownAddresses.forEach((address) =>
						interpretersForSelect.push({
							label: `${interpreter.metadata.name}: ${address.interpreter}`,
							value: {
								id: interpreter.id,
								interpreter: address.interpreter,
								deployer: address.deployer
							}
						})
					);
				}
			});
		});
		return interpretersForSelect;
	};

	$: availableChains = getCommonChains($page.data.interpreters, metadata);

	// creating an ethers contract instance with the selected known address
	$: if (typeof contractAddress == 'string' && ethers.utils.isAddress(contractAddress))
		defaultEvmStores.attachContract('selectedContract', contractAddress, abi.abi);

	// submit the transaction
	const submit = async () => {
		if (selectedInterpreter == -1) throw Error('No interpreter selected');
		if (!metadata.interpreterFields)
			throw Error('Interpreter and deploy fields not defined in metadata');
		console.log(get(abi.abi, metadata.interpreterFields.deployerFieldPath));
		result[0][get(abi.abi, metadata.interpreterFields.deployerFieldPath).name] =
			selectedInterpreter.deployer;
		result[0][get(abi.abi, metadata.interpreterFields.interpreterFieldPath).name] =
			selectedInterpreter.interpreter;
		console.log(result);
		await $contracts.selectedContract[methodName](...result);
	};

	const saveExpression = async ({ detail: { raw } }: { detail: { raw: string } }) => {
		if (selectedInterpreter == -1) throw Error('No interpreter selected');
		presaveExpression = {
			raw_expression: raw,
			contract,
			interpreter: selectedInterpreter?.id
		};
		expressionToSave = raw;
		openNewExpModal = true;
	};

	const loadExpression = async ({ detail }: { detail: any }) => {
		loadRaw = detail.loadRaw;
		loadExpressionModal = true;
	};

	const loadSelectedExpression = async ({ detail }: { detail: any }) => {
		loadExpressionModal = false;
		console.log(detail);
		loadRaw(detail.expression.raw_expression);
	};

	$: connectedChainName = allChainsData.find((chain) => chain.chainId == $chainId)?.name;

	$: console.log(availableChains, selectedChain);
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
		<span>Select an interpreter</span>
		<Select
			items={getInterpretersForChain($page.data.interpreters, selectedChain)}
			bind:value={selectedInterpreter}
		/>
	{/if}
	{#if selectedInterpreter && selectedInterpreter !== -1}
		<span>Select a method to write</span>
		<Select items={writeMethods} bind:value={methodName} />
	{/if}
</div>
{#key methodName}
	{#if typeof methodName == 'string'}
		<div in:fade class="mb-12">
			{#key methodName}
				<AutoAbiFormSeparated
					abi={abi.abi}
					{metadata}
					{methodName}
					bind:result
					on:save={saveExpression}
					on:load={loadExpression}
					showInterpreterFields={false}
				/>
			{/key}
			<div class="flex flex-col gap-y-4 p-4 border-gray-300 rounded-lg border mt-8">
				{#if !$signer}
					<div class="self-center">
						<ConnectWallet />
					</div>
				{:else}
					<div class="flex gap-x-2 items-center">
						<div class="w-3 h-3 rounded-full bg-green-600" />
						<span>Connected to {connectedChainName}</span>
					</div>
					<div class="flex flex-col gap-y-2">
						{#if knownAddresses?.length}
							<span
								>Select from known addresses for this contract on {allChainsData.find(
									(chain) => chain.chainId == $chainId
								)?.name}</span
							>
							<Select items={knownAddresses} bind:value={contractAddress} />
						{:else}
							<span class="text-gray-500">No known deployments for this chain.</span>
						{/if}
					</div>
					<div class="self-start">
						<Button disabled={contractAddress == -1} on:click={submit} variant="primary"
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
		<Auth />
	{/if}
</Modal>

<Modal bind:open={loadExpressionModal}>
	{#if $page.data.session}
		<LoadExpressionModal on:select={loadSelectedExpression} />
	{:else}
		<Auth />
	{/if}
</Modal>
