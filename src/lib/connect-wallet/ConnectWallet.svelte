<script lang="ts">
	import { connectWallet } from '$lib/connect-wallet';
	import { Button } from '@rainprotocol/rain-svelte-components';

	export let variant = 'primary';
</script>

<Button {variant} on:click={connectWallet}>Connect Wallet</Button>
