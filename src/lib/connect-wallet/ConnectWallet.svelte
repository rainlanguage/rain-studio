<script lang="ts">
	import { connectWallet } from '$lib/connect-wallet';
	import { Button } from 'rain-svelte-components/package';
</script>

<Button variant="primary" on:click={connectWallet}>Connect Wallet</Button>
