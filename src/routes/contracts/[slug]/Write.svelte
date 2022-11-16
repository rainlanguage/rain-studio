<script lang="ts">
	import { Button, Select } from 'rain-svelte-components/package';
	import AutoAbiFormSeparated from 'rain-svelte-components/package/auto-abi-form/AutoAbiFormSeparated.svelte';
	import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
	import { ethers } from 'ethers';
	import { chainId, defaultEvmStores, contracts, signer, allChainsData } from 'svelte-ethers-store';

	export let metadata: ContractMetadata, abi: any;

	$: writeMethods = abi.abi
		.filter(
			(def: any) =>
				def.type == 'function' &&
				def.inputs.length &&
				def.name !== 'createChild' &&
				def.stateMutability !== 'view'
		)
		.map((def: any) => ({ label: def.name, value: def.name }));

	let methodName: string | number;
	let result: any = [];

	let contractAddress: string | -1;

	$: knownAddresses = metadata.addresses
		.filter((chain) => chain.chainId == $chainId)[0]
		?.knownAddresses.map((address) => {
			return { label: address, value: address };
		});

	$: if (typeof contractAddress == 'string' && ethers.utils.isAddress(contractAddress))
		defaultEvmStores.attachContract('selectedContract', contractAddress, abi.abi);

	const connect = () => {
		defaultEvmStores.setProvider();
	};

	const submit = async () => {
		await $contracts.selectedContract[methodName](...result);
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
			<AutoAbiFormSeparated abi={abi.abi} {metadata} {methodName} bind:result />
		{/key}
		<div class="self-start">
			<Button on:click={submit} variant="primary">Submit</Button>
		</div>
	{/if}
{/key}
