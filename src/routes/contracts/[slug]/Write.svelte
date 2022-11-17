<script lang="ts">
	import { Button, Select, Modal } from 'rain-svelte-components/package';
	import AutoAbiFormSeparated from 'rain-svelte-components/package/auto-abi-form/AutoAbiFormSeparated.svelte';
	import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
	import { ethers } from 'ethers';
	import { chainId, defaultEvmStores, contracts, signer, allChainsData } from 'svelte-ethers-store';
	import { supabaseClient } from '$lib/supabaseClient';
	import SaveExpression, { type PresaveExpression } from '$lib/expressions/SaveExpression.svelte';

	export let metadata: ContractMetadata, abi: any, contract: any;

	let methodName: string | number; // the selected method
	let result: any = []; // the state of the the form
	let contractAddress: string | -1; // the selected contract address

	let openNewExpModal: boolean = false;
	let expressionToSave: string;
	let presaveExpression: PresaveExpression;

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

	// creating an ethers contract instance with the selected known address
	$: if (typeof contractAddress == 'string' && ethers.utils.isAddress(contractAddress))
		defaultEvmStores.attachContract('selectedContract', contractAddress, abi.abi);

	// submit the transaction
	const submit = async () => {
		await $contracts.selectedContract[methodName](...result);
	};

	const saveExpression = async ({ detail: { raw } }: { detail: { raw: string } }) => {
		presaveExpression = {
			raw_expression: raw,
			contract,
			interpreter: {
				id: '761f3744-fe08-4e71-b38c-faaf7b447455',
				metadata: { name: 'Rainterpreter' }
			}
		};
		expressionToSave = raw;
		openNewExpModal = true;
	};

	const connect = () => {
		defaultEvmStores.setProvider();
	};
</script>

<div class="flex flex-col gap-y-4">
	{#if !$signer}
		<div>
			<Button on:click={connect}>Connect your wallet</Button>
		</div>
	{:else}
		<div class="flex gap-x-2 items-center">
			<div class="w-3 h-3 rounded-full bg-green-600" />
			<span>Connected</span>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<span
				>Select from known addresses for {allChainsData.find((chain) => chain.chainId == $chainId)
					.name}</span
			>
			<span>Select a method to write</span>
			{#if knownAddresses?.length}
				<Select items={knownAddresses} bind:value={contractAddress} />
			{:else}
				<span class="text-gray-500">No known deployments for this chain.</span>
			{/if}
			<Select items={writeMethods} bind:value={methodName} />
		</div>
	{/if}
</div>
{#key methodName}
	{#if typeof methodName == 'string'}
		{#key methodName}
			<AutoAbiFormSeparated
				abi={abi.abi}
				{metadata}
				{methodName}
				bind:result
				on:save={saveExpression}
			/>
		{/key}
		<div class="self-start">
			<Button on:click={submit} variant="primary">Submit</Button>
		</div>
	{/if}
{/key}

<Modal bind:open={openNewExpModal}>
	<SaveExpression {presaveExpression} />
</Modal>
