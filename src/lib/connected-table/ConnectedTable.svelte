<script lang="ts">
	import { Button, Ring } from 'rain-svelte-components/package';
	import { signerAddress, connected, allChainsData, chainId } from 'svelte-ethers-store';
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import ModalUnlinkAddress from '$lib/connected-table/ModalUnlinkAddress.svelte';
	import ModalLinkAddress from '$lib/connected-table/ModalLinkAddress.svelte';
	import { isLinked } from './';

	// When size is small, use displayAddress component and hide the Connect Button/Unlink
	export let size: 'normal' | 'small' = 'normal';

	let loading = false;
	let openedModalUnlink = false;
	let openedModalLink = false;

	const searchAddress = async () => {
		loading = true;
		const user = $page.data?.session?.user;

		let { data, error } = await supabaseClient
			.from('wallets')
			.select('user_id')
			.eq('address', $signerAddress)
			.single();

		if (error || user?.id !== data?.user_id) {
			isLinked.set(false);
		} else {
			isLinked.set(true);
		}

		loading = false;
	};

	$: networkName = allChainsData.find((_chain) => _chain.chainId == $chainId)?.name;

	$: if ($signerAddress) {
		searchAddress();
	}
</script>

<ModalUnlinkAddress bind:openedModal={openedModalUnlink} address={$signerAddress} />

<ModalLinkAddress bind:openedModal={openedModalLink} address={$signerAddress} />

<div class="flex flex-col items-start gap-y-2.5 ">
	<p class="small-regular text-gray-600">
		{$connected ? 'Connected' : 'Not connected'}
		<span class={$connected ? 'green' : 'red'}>•</span>
	</p>
	{#if $connected}
		<div class="border-[1px] border-gray-300 rounded-[10px] p-[10px]">
			<p class="leading-[21px] tracking-[-0.01em] text-gray-500">
				{networkName}
			</p>
			<p class="font-mono text-[15px] leading-5 tracking-[-0.01em] text-black">
				{$signerAddress}
			</p>
		</div>
	{/if}
	<div>
		{#if $signerAddress}
			{#if loading}
				<Ring size="44px" color="#cbd5e1" />
			{:else if $isLinked}
				<Button variant="black" on:click={() => (openedModalUnlink = true)}
					>Unlink this wallet</Button
				>
			{:else}
				<div>
					<Button variant="black" on:click={() => (openedModalLink = true)}>Link this wallet</Button
					>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style lang="postcss">
	.small-regular {
		@apply text-[13px] leading-[17px] tracking-[-0.01em];
	}
	.red {
		@apply text-[#ff0000];
	}
	.green {
		@apply text-[#00a73c];
	}
</style>
