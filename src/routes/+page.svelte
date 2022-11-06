<script lang="ts">
	import { Parser, Switch } from 'rain-svelte-components/package';
	import { page } from '$app/stores';
	import Account from '$lib/Account.svelte';
	import Auth from '$lib/Auth.svelte';
	import { signer, defaultEvmStores } from 'svelte-ethers-store';

	const connect = () => {
		defaultEvmStores.setProvider();
	};
</script>

{#if !$page.data.session}
	<Auth />
{:else}
	<Account session={$page.data.session} />
{/if}
