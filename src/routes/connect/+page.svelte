<script lang="ts">
	import { disconectWallet, changeNetwork } from '$lib/connect-wallet';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { Button } from '@rainprotocol/rain-svelte-components';
	import { wagmiLoaded, loading, connected, connection, web3Modal } from 'svelte-wagmi';
	import { getAccount, switchNetwork } from '@wagmi/core';
	import * as chains_ from '@wagmi/core/chains';
	import {  } from '$lib/utils';
</script>

<div class="flex flex-col gap-y-5">
	<div class="ml-2 mt-2 flex gap-x-4">
		<div class="border p-2">
			{#if $wagmiLoaded}
				wagmiLoaded
			{:else}
				not wagmiLoaded
			{/if}
		</div>
		<div class="border p-2">
			{#if $loading}
				loading
			{:else}
				not loading
			{/if}
		</div>
		<div class="border p-2">
			{#if $connected}
				connected
			{:else}
				not connected
			{/if}
		</div>
	</div>

	<div class="ml-2 mt-2 flex gap-x-4">
		<div>
			<ConnectWallet />
		</div>

		<div>
			<Button variant={'default'} on:click={disconectWallet}>Disconnect Wallet</Button>
		</div>
		<div>
			<Button
				variant={'secondary'}
				on:click={async () => {
					await changeNetwork(137);
				}}>Change network</Button
			>
		</div>
	</div>
</div>
