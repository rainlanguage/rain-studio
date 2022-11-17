
<script lang="ts">
	import { page } from '$app/stores';
	import Account from '$lib/Account.svelte';
	import Background from '$lib/Background.svelte';
	import { Button } from 'rain-svelte-components/package';
	import { supabaseClient } from '$lib/supabaseClient';


	import { v4 as uuidv4 } from 'uuid';


  import { defaultEvmStores, signerAddress } from "svelte-ethers-store";
	
	import { afterUpdate } from 'svelte';
	
  import { providers  } from "ethers";
	import Web3Modal from 'web3modal';
	import WalletConnectProvider  from "@walletconnect/web3-provider/dist/umd/index.min";

	let web3Modal: any;
	let ethersProvider: any;

	const providerOptions = {
		injected: {
			display: {
				name: "Metamask",
				description: "Connect with the provider in your Browser"
			},
			package: null
		},
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				infuraId: "0f270373e0934beda174c537257386b0",
			}
		},
	};

	afterUpdate(() => {
		web3Modal = new Web3Modal({
			cacheProvider: false,
			providerOptions,
		});

	})


	const connectWallet = async () => {
		await web3Modal.clearCachedProvider();

    const provider = await web3Modal.connect();
    ethersProvider = new providers.Web3Provider(provider);
		defaultEvmStores.setProvider(provider);
		const network = await ethersProvider.getNetwork();
		// console.log(network);
  };

	const getWallets = async () => {
		const user = $page.data.session.user;

		const { data, error, status } = await supabaseClient
			.from('profiles')
			.select(`username, full_name, website, avatar_url, wallets(*)`)
			.eq('id', user.id)
			.single();

			console.log(data);
	};

	const linkAddress = async () => {
		const user = $page.data.session.user;

		const updates = {
			id: uuidv4(),
			address: $signerAddress,
			user_id: user.id
		};
		
		let {error}= await supabaseClient.from('wallets').insert(updates);

		if (error) {
			console.log("=== Link address error: ")
			console.log(error)
		};
	}


</script>
<Background>
	<Account session={$page.data.session} />
	<div class="flex flex-col w-max bg-white p-6 rounded-lg shadow-md space-y-3 ml-5">
		{#if !$signerAddress}
			<Button disabled={!!$signerAddress} on:click={connectWallet} >
				Connect wallet
			</Button>
    {:else}
		<div class="space-y-2">
			<Button variant="primary" on:click={linkAddress} >
				Link address
			</Button>
			<Button variant="primary" on:click={getWallets} >
				See addressess
			</Button>
			<Button disabled={!$signerAddress} on:click={async () => defaultEvmStores.disconnect()} >
				Disconnect
			</Button>

		</div>
		{/if}
		<p>{$signerAddress}</p>

	</div>
	
</Background>

