<script lang="ts">
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { Button } from '@rainprotocol/rain-svelte-components';
	import { getContractDeployTxData, RainNetworks, type DISpair } from 'rain-x-deploy';
	import { provider, signer } from 'svelte-ethers-store';

	const pave = async () => {
		const addr_ = await $signer.getAddress();
		console.log('addr: ', addr_);
	};
</script>

{#if !$signer}
	<div class="flex flex-col gap-y-6 self-center">
		<p>You should connect your wallet before interacting with the newtork</p>
		<ConnectWallet />
	</div>
{:else}
	<Button on:click={pave}>Click here</Button>
{/if}
