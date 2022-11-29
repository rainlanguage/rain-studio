<script lang="ts">
	import { Button } from 'rain-svelte-components/package';
	import { signerAddress, connected, signer } from 'svelte-ethers-store';
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import { createMessage, postRequest } from '$lib/utils';
	import { connectWallet, disconectWallet } from '$lib/connect-wallet';

	let loading = false;
	let message = '';

	const linkAddress = async () => {
		message = 'Waiting for sign...';

		const address = $signerAddress;

		// Get the nonce with the current address to sign the message
		const nonceResp = await (await postRequest('/api/get_nonce', { address })).json();
		if (!nonceResp.success) {
			const error = nonceResp.error.message;
			message = error;
			alert(error);
			return;
		}

		// Sign the message
		const messageToSign = createMessage(address, nonceResp.id);
		const signedMessage = await $signer.signMessage(messageToSign);

		message = 'Linking the address...';

		// Request to link address
		const linkResp = await (
			await postRequest('/api/link_address', { address, signedMessage })
		).json();
		if (!linkResp.success) {
			message = 'The address could not be linked to your account.';
			alert(message);
			return;
		}

		message = 'Address linked to this account.';
		alert('Address linked to this account.');
	};

	const searchAddress = async () => {
		loading = true;
		const user = $page.data.session.user;

		console.log('here1');

		let { data, error } = await supabaseClient
			.from('wallets')
			.select('user_id')
			.eq('address', $signerAddress)
			.single();

		if (error) {
			message = 'The address is not linked to your account';
		} else if (user.id === data?.user_id) {
			message = 'This address is linked to your account';
		} else {
			message = 'This address is linked to other account';
		}

		loading = false;
	};

	// Only search if connected
	$: if ($connected) {
		searchAddress();
	}
</script>

<div class="flex flex-col w-max bg-white p-6 rounded-lg shadow-md space-y-3 ml-5">
	{#if !$signerAddress}
		<Button disabled={!!$signerAddress} on:click={connectWallet}>Connect wallet</Button>
	{:else}
		<Button variant="primary" on:click={linkAddress}>Link you address</Button>
		<div>
			<Button disabled={!$signerAddress} on:click={disconectWallet}>Disconnect</Button>
		</div>
	{/if}
</div>

{#if $signerAddress}
	<div class="flex flex-col w-max bg-white p-6 rounded-lg shadow-md space-y-3 ml-5">
		<div class="space-y-2">
			<p>
				Address connected: {$signerAddress}
			</p>
			<p class="border-t-2 border-double border-gray-300 pt-1.5">
				{loading ? 'Loading...' : message}
			</p>
		</div>
	</div>
{/if}
