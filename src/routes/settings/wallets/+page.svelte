<script lang="ts">
	import { signerAddress } from 'svelte-ethers-store';
	import { page } from '$app/stores';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';
	import ModalUnlinkAddress from '$lib/connected-table/ModalUnlinkAddress.svelte';
	import { HoverTooltip } from '@rainprotocol/rain-svelte-components';

	let openedModal = false;
	let addressToUnlink = '';

	$: linkedAddresses = $page.data.wallets_linked;
</script>

<ModalUnlinkAddress bind:openedModal address={addressToUnlink} />

<div class="flex flex-col gap-y-[30px]">
	<div class="flex flex-col gap-y-2.5">
		<ConnectedTable />
		{#if !$signerAddress}
			<div>
				<ConnectWallet variant="black" />
			</div>
		{/if}
	</div>
	<div
		class="flex flex-col items-start items-stretch rounded-[10px] border-[1px] border-neutral-300"
	>
		<span
			class="border-b-[1px] border-neutral-300 py-[15px] pl-[10px] text-[18px] font-medium leading-[23px] tracking-[-0.01em]"
			>Linked wallets</span
		>
		<div class="flex w-full flex-col items-start px-[10px]">
			{#if linkedAddresses?.length > 0}
				{#each linkedAddresses as addressElement}
					<div
						class="flex w-full flex-row items-center justify-between gap-[10px] border-b-[1px] py-[10px] last:border-0"
					>
						<p class="font-mono text-xs tracking-[-0.01em] text-black">
							{addressElement}
						</p>
						{#if linkedAddresses?.length > 1}
							<button
								class="text-right text-[13px] leading-[17px] tracking-[-0.01em] text-neutral-500"
								on:click={() => {
									openedModal = true;
									addressToUnlink = addressElement;
								}}
							>
								unlink
							</button>
						{:else}
							<HoverTooltip placeHolder="Cannot delete last address">
								<button
									class="text-right text-[13px] leading-[17px] tracking-[-0.01em] text-neutral-500"
									disabled
								>
									unlink
								</button>
							</HoverTooltip>
						{/if}
					</div>
				{/each}
			{:else}
				<div
					class="flex w-full flex-row items-center justify-between gap-[10px] border-b-[1px] py-[10px] last:border-0"
				>
					<p class="font-mono text-xs tracking-[-0.01em] text-black">
						There is no wallets linked to this account
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
