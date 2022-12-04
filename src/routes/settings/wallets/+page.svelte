<script lang="ts">
	import { signerAddress } from 'svelte-ethers-store';
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';
	import ModalUnlinkAddress from '$lib/connected-table/ModalUnlinkAddress.svelte';
	import { isLinked } from '$lib/connected-table';

	let linkedAddresses: string[] = [];
	let openedModal = false;
	let addressToUnlink = '';

	const searchAddresses = async () => {
		const user = $page.data.session.user;

		let { data, error } = await supabaseClient
			.from('wallets')
			.select('user_id, address')
			.eq('user_id', user.id);

		if (!error) linkedAddresses = data?.map((wallet) => wallet.address);
	};

	searchAddresses();

	$: if ($signerAddress || $isLinked || !openedModal) {
		searchAddresses();
	}
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
		class="flex flex-col items-start rounded-[10px] border-neutral-300 border-[1px] items-stretch"
	>
		<span
			class="py-[15px] pl-[10px] border-b-[1px] border-neutral-300 text-[18px] font-medium leading-[23px] tracking-[-0.01em]"
			>Linked wallets</span
		>
		<div class="w-full flex flex-col items-start px-[10px]">
			{#if linkedAddresses.length > 0}
				{#each linkedAddresses as addressElement}
					<div
						class="w-full flex flex-row justify-between items-center py-[10px] gap-[10px] border-b-[1px] last:border-0"
					>
						<p class="font-mono text-xs tracking-[-0.01em] text-black">
							{addressElement}
						</p>
						<button
							class="text-[13px] leading-[17px] text-right tracking-[-0.01em] text-neutral-500"
							on:click={() => {
								openedModal = true;
								addressToUnlink = addressElement;
							}}
						>
							unlink
						</button>
					</div>
				{/each}
			{:else}
				<div
					class="w-full flex flex-row justify-between items-center py-[10px] gap-[10px] border-b-[1px] last:border-0"
				>
					<p class="font-mono text-xs tracking-[-0.01em] text-black">
						There is no wallets linked to this account
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
