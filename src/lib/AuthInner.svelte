<script lang="ts">
	import { signer, signerAddress, connected } from 'svelte-ethers-store';
	import { enhance } from '$app/forms';
	import { Button } from '@rainprotocol/rain-svelte-components';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';

	// Types
	import type { SubmitFunction } from '@sveltejs/kit/types';

	/**
	 * Function that wrap the fetch to only ask for the message based on the address.
	 */
	const getMessage = async (address_: string) => {
		const resp = await fetch(`/api/auth/request_message`, {
			method: 'POST',
			body: JSON.stringify({
				address: address_
			})
		});

		if (!resp.ok) {
			throw new Error('It was not possible to create the message');
		}
		return (await resp.json()).message;
	};

	const submitFunction: SubmitFunction = async ({ data }) => {
		// Get the message to signed based on the current address connected.
		// Then show the pop-up from the wallet (metamask) to sign the message.
		// If the user cancel/reject to sign the message, the submit is cancelled (no sign-in or sign-up).
		const message = await getMessage($signerAddress);
		const signature = await $signer.signMessage(message);

		// Set the signature to the form data that will be sent to the server
		data.set('signature', signature);

		return async ({ result, update }) => {
			if (result.type == 'success') {
				update();
			}
		};
	};
</script>

<div class="flex flex-col gap-y-4">
	<!-- <div class="flex flex-col gap-y-2"> -->
	<h1 class="text-2xl font-semibold">Welcome back</h1>
	<!-- </div> -->
	{#if $signerAddress && $connected}
		<p class="text-sm text-gray-700">Sign into your account</p>
		<form
			method="POST"
			action="/sign-in"
			class="flex flex-col gap-y-4"
			use:enhance={submitFunction}
		>
			<input
				hidden
				name="address"
				bind:value={$signerAddress}
				class="rounded-[10px] bg-gray-300 p-2"
			/>

			<Button variant="primary" classes="text-center">Sign in with your wallet</Button>
		</form>
	{:else}
		<p class="text-sm text-gray-700">Connect your wallet to continue</p>
		<ConnectWallet />
	{/if}
</div>
