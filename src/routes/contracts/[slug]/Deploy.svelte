<script lang="ts">
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';
	import { Button, InputDropdown, Select } from '@rainprotocol/rain-svelte-components';
	import { getContractDeployTxData, RainNetworks, type DISpair } from 'rain-x-deploy';
	import { chainId, provider, signer } from 'svelte-ethers-store';
	import { getCommonChains, getNameFromChainId } from './write';
	import { changeNetwork } from '$lib/connect-wallet';

	export let contractAddresses: ContractAddressRow[], deployerAddresses: DeployerAddressesRow[];

	const pave = async () => {
		const addr_ = await $signer.getAddress();
		console.log('addr: ', addr_);
	};

	let selectedDeployer: any;
	let selectedItem: any;
	let items: any;

	let selectedChain: number;
	let oldChain = -1;

	const changeChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;

		if ($chainId != chainIdSelected) {
			const resp = await changeNetwork(chainIdSelected);
			if (!resp.success) {
				selectedChain = oldChain;
			} else {
				// Reset current contract selected
				oldChain = selectedChain;
			}
		}
	};

	$: availableChains = getCommonChains(deployerAddresses, contractAddresses);
</script>

{#if !$signer}
	<div class="flex flex-col gap-y-6 self-center">
		<p>You should connect your wallet before interacting with the newtork</p>
		<ConnectWallet />
	</div>
{:else}
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

		<Button on:click={pave}>Click here</Button>
		<div>
			<InputDropdown
				bind:value={selectedDeployer}
				bind:selectedItem
				{items}
				placeholder="Select interpreter"
				classInput="text-neutral-600 border border-neutral-100 bg-white rounded-md px-0 py-1 text-xs w-full pl-2"
				classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md text-xs shadow cursor-default font-mono"
			/>
		</div>
	</div>
{/if}
