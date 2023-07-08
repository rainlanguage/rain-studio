<script lang="ts">
	import { allChainsData, chainId, signer, defaultEvmStores } from 'svelte-ethers-store';
	import { setContext } from 'svelte';
	import { page } from '$app/stores';

	import type { Abi } from 'abitype';
	import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';
	import { Button, InitializeForm, Select } from '@rainprotocol/rain-svelte-components';
	import {
		getCommonChainsInAddresses,
		getKnownContractAddressesForChain,
		getNameFromChainId
	} from '$lib/contracts';
	import { changeNetwork } from '$lib/connect-wallet';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { ethers } from 'ethers';

	export let abi: Abi;
	export let contract_meta: any;
	export let contractAddresses: ContractAddressRow[];
	export let deployerAddresses: DeployerAddressesRow[];

	let selectedChain: number;
	// Variable used to save old chain selected in case the change chain fail
	let oldChain = -1;
	let result: any[];
	let isInitializable: boolean;
	let selectedImplementation: string | -1; // the selected implementation address
	let transactionError: any;

	setContext('EVALUABLE_ADDRESSES', {
		getDeployers: async () => {
			return deployerAddresses.filter((address) => selectedChain == address.chain_id);
		}
	});

	const changeChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;

		if ($chainId != chainIdSelected) {
			const resp = await changeNetwork(chainIdSelected);
			if (!resp.success) {
				selectedChain = oldChain;
			} else {
				// Reset current contract implementation selected
				selectedImplementation = -1;
				oldChain = selectedChain;
			}
		}
	};

	const getCloneFactories = async (searchValue_: string, selectedNetworks_: Array<number>) => {
		const resp = await fetch(`${$page.url.origin}/contracts`, {
			method: 'POST',
			body: JSON.stringify({
				searchValue: searchValue_,
				selectedNetworks: selectedNetworks_,
				offset_: 0
			})
		});

		console.log(resp);

		if (resp.ok) {
			console.log('resp is ok');
			console.log(await resp.json());
			// const { contractsFiltered, counterFiltered } = await resp.json();
		}
	};

	// submit the transaction
	const submit = async () => {
		// creating an ethers contract instance with the selected known address
		if (
			!(typeof selectedImplementation == 'string') ||
			!ethers.utils.isAddress(selectedImplementation)
		) {
			transactionError = new Error('Not an addreess');
		}

		// Send to the clonable
		// handling error cases
		// try {
		// 	await $contracts.selectedContract[selectedMethod.name](...result);
		// } catch (error) {
		// 	// Maybe we need to handle each type of error?
		// 	transactionError = error;
		// }
	};

	$: connectedChainName = allChainsData.find((chain) => chain.chainId == $chainId)?.name;
	$: availableChains = getCommonChainsInAddresses(deployerAddresses);
	$: knownAddressesForThisChain = getKnownContractAddressesForChain(
		contractAddresses,
		selectedChain,
		{ onlyContracts: true }
	);
</script>

<button
	on:click={() => {
		getCloneFactories();
	}}
	class="w-fit rounded bg-red-300 p-2 hover:bg-red-500"
>
	Seeach clonables
</button>
<button
	on:click={() => {
		console.log(knownAddressesForThisChain);
	}}
	class="w-fit rounded bg-red-300 p-2 hover:bg-red-500"
>
	See addresses
</button>

<div class="flex flex-col gap-y-4">
	<span>Select a chain</span>
	<Select
		items={availableChains.map((chainId_) => ({
			label: getNameFromChainId(chainId_),
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
				<div class="flex flex-col gap-y-2">
					{#if knownAddressesForThisChain.length}
						<span
							>Select from known addresses for this contract on {allChainsData.find(
								(chain) => chain.chainId == $chainId
							)?.name}</span
						>
						<Select items={knownAddressesForThisChain} bind:value={selectedImplementation} />
					{:else}
						<span class="text-gray-500">No known deployments for this chain.</span>
					{/if}
				</div>
				<div class="self-start">
					<Button disabled={selectedImplementation == -1} on:click={submit} variant="primary"
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
	{/if}
</div>
