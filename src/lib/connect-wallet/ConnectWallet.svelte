<script lang="ts">
	import { connectWallet } from '$lib/connect-wallet';
	import { Button } from 'rain-svelte-components/package';

	export let variant = 'primary';
</script>

<Button {variant} on:click={connectWallet}>Connect Wallet</Button>
