<script lang="ts">
	import { Parser, Switch, Button } from 'rain-svelte-components/package';
	import { page } from '$app/stores';
	import Account from '$lib/Account.svelte';
	import Auth from '$lib/Auth.svelte';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import {
		signer,
		defaultEvmStores,
		signerAddress,
		connected,
		allChainsData,
		chainId
	} from 'svelte-ethers-store';
	import { supabaseClient, refreshClient } from '$lib/supabaseClient';
	import { createClient } from '@supabase/auth-helpers-sveltekit';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

	const getMessage = async () => {
		const resp = await fetch(`/api/auth/request_message`, {
			method: 'POST',
			body: JSON.stringify({
				address: $signerAddress,
				chain: $chainId,
				network: 'evm'
			})
		});

		if (resp.ok) {
			return (await resp.json()).message;
		}
	};

	const verifyMessage = async (signature_: string, message_: string) => {
		const resp = await fetch(`/api/auth/verify_message`, {
			method: 'POST',
			body: JSON.stringify({
				signature: signature_,
				message: message_,
				network: 'evm'
			})
		});

		if (resp.ok) {
			return await resp.json();
		}
	};
	const get_session = async () => {
		const resp = await fetch(`/api/auth/get_session`, {
			method: 'POST'
		});

		if (resp.ok) {
			return await resp.json();
		}
	};

	const signinWallet = async () => {
		// const resp1 = await supabaseClient.from('wallets').select(`*`);

		const message = await getMessage();
		const signature = await $signer.signMessage(message);

		const resp = await verifyMessage(signature, message);
		console.log(resp);
		// refreshClient(resp.token);

		// const resp2 = await supabaseClient.from('wallets').select(`*`);
	};

	const connect = () => {
		defaultEvmStores.setProvider();
	};
</script>

Homepage

<div class="w-full flex justify-center gap-x-2">
	{#if $signerAddress}
		<Button on:click={signinWallet}>Sign with wallet</Button>
		<Button on:click={get_session}>get_session</Button>

		<Button
			on:click={async () => {
				const resp2 = await supabaseClient.from('wallets').select(`*`);
				console.log(resp2);
			}}>Query wallets</Button
		>

		<!-- <Button on:click={() => console.log($page.data.session)}>See session</Button> -->
	{:else}
		<ConnectWallet />
	{/if}
</div>
