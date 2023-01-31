<script lang="ts">
	import { Button, Ring, DisplayAddress, HoverTooltip } from 'rain-svelte-components/package';
	import { signerAddress, connected, allChainsData, chainId } from 'svelte-ethers-store';
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import ModalUnlinkAddress from '$lib/connected-table/ModalUnlinkAddress.svelte';
	import ModalLinkAddress from '$lib/connected-table/ModalLinkAddress.svelte';
	import { SearchStatus } from './';
	import { isLinked, isLinkedToOther, currentSearchStatus, alreadySearched } from '$lib/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowUpRight } from '@steeze-ui/heroicons';
	// When size is small, hide the Connect Button/Unlink
	export let size: 'normal' | 'small' = 'normal';

	let loading = false;
	let openedModalUnlink = false;
	let openedModalLink = false;

	const searchAddress = async () => {
		if ($alreadySearched !== $signerAddress) {
			// Save the address to avoid researching same address. Allow to search again when the account is changed.
			alreadySearched.set($signerAddress);

			if ($page.data.wallets_linked.includes($signerAddress)) {
				// It's linked to his account
				isLinked.set(true);
				isLinkedToOther.set(false);
			} else {
				// Search if it's linked to another account or it's available to link this to this acc
				currentSearchStatus.set(SearchStatus.Searching);
				loading = true;

				let { data, error } = await supabaseClient
					.from('wallets_linked')
					.select('user_id')
					.eq('address', $signerAddress);

				if (error || (data && !data.length)) {
					isLinked.set(false);
					isLinkedToOther.set(false);
				} else {
					isLinked.set(false);
					isLinkedToOther.set(true);
				}

				loading = false;
				currentSearchStatus.set(SearchStatus.Finished);
			}
		}
	};

	const openLinkModal = () => {
		openedModalLink = true;
	};

	$: networkName = allChainsData.find((_chain) => _chain.chainId == $chainId)?.name;

	$: if ($signerAddress) {
		searchAddress();
	}
</script>

<ModalUnlinkAddress bind:openedModal={openedModalUnlink} address={$signerAddress} />

<ModalLinkAddress bind:openedModal={openedModalLink} address={$signerAddress} />

<div class="flex w-full flex-col items-start gap-y-2.5">
	<p class="small-regular text-gray-600">
		{$connected ? 'Connected' : 'Not connected'}
		<span class={$connected ? 'green' : 'red'}>•</span>
	</p>
	{#if $connected}
		<div class="w-full rounded-[10px] border-[1px] border-gray-300 p-[10px]">
			<p class="leading-[21px] tracking-[-0.01em] text-gray-500">
				{networkName}
			</p>
			{#if size == 'normal'}
				<p class="font-mono text-[15px] leading-5 tracking-[-0.01em] text-black">
					{$signerAddress}
				</p>
			{:else}
				<DisplayAddress address={$signerAddress} />
			{/if}
		</div>
	{/if}
	{#if $signerAddress}
		{#if size == 'normal'}
			<div>
				{#if loading}
					<Ring size="44px" color="#cbd5e1" />
				{:else if $isLinked}
					{#if $page.data.wallets_linked && $page.data.wallets_linked.length > 1}
						<Button variant="black" on:click={() => (openedModalUnlink = true)}
							>Unlink this wallet</Button
						>
					{:else}
						<HoverTooltip placeHolder="Cannot delete last address">
							<Button variant="black" disabled>Unlink this wallet</Button>
						</HoverTooltip>
					{/if}
				{:else if $isLinkedToOther}
					<HoverTooltip placeHolder="This wallet is linked to other account">
						<div>
							<Button variant="black" disabled on:click={openLinkModal}>Link this wallet</Button>
						</div>
					</HoverTooltip>
				{:else}
					<div>
						<Button variant="black" on:click={openLinkModal}>Link this wallet</Button>
					</div>
				{/if}
			</div>
		{:else if !$isLinked && !$isLinkedToOther && !loading}
			<button class="flex items-center gap-x-1" on:click={openLinkModal}>
				<p class="text-[13px] leading-[17px] tracking-[-0.01em] text-neutral-600">
					Link this wallet
				</p>
				<Icon src={ArrowUpRight} theme="solid" size="10" />
			</button>
		{/if}
	{/if}
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
