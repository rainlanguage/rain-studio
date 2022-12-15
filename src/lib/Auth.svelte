<script lang="ts">
	import { signer, signerAddress, connected } from 'svelte-ethers-store';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { Button } from 'rain-svelte-components/package';
	import { refreshClient } from '$lib/supabaseClient';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import Background from '$lib/Background.svelte';

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
				// Is there a way to trigger this refreshClient (or similar) front the server? Anyway the JWT will be on visible on cookies.
				refreshClient(result.data?._token);
			}

			// Update() or goto() functions does not work to the main goal here. The user had to refresh the page to be fully "logged".
			//
			// -- update(): This update the page and the server will be able to get the session, but the nav is not updated.
			// -- goto('/dashboard'): This redirect to the route and update the nav only in that route. When changed to another route,
			// the nav is not updated again.
			//
			// The only way that work is set directly the location
			// @ts-ignore
			window.location = '/dashboard';
		};
	};
</script>

<Background>
	<div
		class="bg-white rounded-xl p-8 border border-gray-200 -mt-20"
		in:fly={{ y: 20, duration: 1000 }}
	>
		<div class="flex flex-col gap-y-4 w-80">
			<!-- <div class="flex flex-col gap-y-2"> -->
			<h1 class="text-2xl font-semibold">Welcome back</h1>
			<!-- </div> -->
			{#if $signerAddress && $connected}
				<p class="text-gray-700 text-sm">Sign into your account</p>
				<form
					method="POST"
					action="/sign-in"
					class="flex flex-col gap-y-4 w-80"
					use:enhance={submitFunction}
				>
					<input
						hidden
						name="address"
						bind:value={$signerAddress}
						class="p-2 bg-gray-300 rounded-[10px]"
					/>

					<Button variant="primary" classes="text-center w-full">Sign in with your wallet</Button>
				</form>
			{:else}
				<p class="text-gray-700 text-sm">Connect your wallet to continue</p>
				<ConnectWallet />
			{/if}
		</div>
	</div>
</Background>
