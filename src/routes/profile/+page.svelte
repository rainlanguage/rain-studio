<script lang="ts">
	import { providers } from 'ethers';
	import { onMount } from 'svelte';
	import { Button } from 'rain-svelte-components/package';
	import { defaultEvmStores, signerAddress, connected } from 'svelte-ethers-store';
	import Web3Modal from 'web3modal';
	import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min';

	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import Account from '$lib/Account.svelte';
	import Background from '$lib/Background.svelte';
	import { supabaseClient } from '$lib/supabaseClient';

	let web3Modal: Web3Modal;
	let ethersProvider: providers.Web3Provider;

	let wallets: any[] = [];
	let loading = false;
	let message = '';

	const providerOptions = {
		injected: {
			display: {
				name: 'Metamask',
				description: 'Connect with the provider in your Browser'
			},
			package: null
		},
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				infuraId: '0f270373e0934beda174c537257386b0'
			}
		}
	};

	onMount(() => {
		web3Modal = new Web3Modal({
			cacheProvider: true,
			providerOptions
		});
	});

	const connectWallet = async () => {
		const provider = await web3Modal.connect();
		ethersProvider = new providers.Web3Provider(provider);
		defaultEvmStores.setProvider(provider);
		searchLinkAddress();
	};

	const getWallets = async () => {
		const user = $page.data.session.user;
	};

	const searchLinkAddress = async () => {
		loading = true;
		const user = $page.data.session.user;

		let { data, error } = await supabaseClient
			.from('profiles')
			.select('wallets(*)')
			.eq('id', user.id)
			.single();

		const value = data?.wallets.find((element: any) => {
			if (element.address == $signerAddress) {
				return true;
			}
		});

		if (error) {
			message = error.message;
		} else if (value) {
			message = 'This address is linked to your account.';
		} else {
			message = "You don't have address linked to your account.";
		}

		loading = false;
	};

	$: if ($connected) {
		searchLinkAddress();
	}
</script>

<Background>
	<Account session={$page.data.session} />

	<div class="flex flex-col w-max bg-white p-6 rounded-lg shadow-md space-y-3 ml-5">
		{#if !$signerAddress}
			<Button disabled={!!$signerAddress} on:click={connectWallet}>Connect wallet</Button>
		{:else}
			<div class="space-y-2">
				<form
					method="POST"
					action="?/linkAddress"
					use:enhance={() => {
						loading = true;
						return async ({ result }) => {
							searchLinkAddress();
							await applyAction(result);
						};
					}}
				>
					<input name="address" value={$signerAddress} hidden />
					<Button>New Link</Button>
				</form>

				<Button disabled={!$signerAddress} on:click={async () => defaultEvmStores.disconnect()}>
					Disconnect
				</Button>
			</div>
		{/if}
	</div>

	<div class="flex flex-col w-max bg-white p-6 rounded-lg shadow-md space-y-3 ml-5">
		{#if $signerAddress}
			<div class="space-y-2">
				<p>{loading ? 'Searching' : message}</p>
				<p>Address connected: {$signerAddress}</p>
			</div>
		{/if}
	</div>
</Background>
