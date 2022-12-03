<script lang="ts">
	import { Button, Modal } from 'rain-svelte-components/package';
	import { createMessage, postRequest } from '$lib/utils';
	import { signer } from 'svelte-ethers-store';
	import { isLinked } from '.';

	export let openedModal = false;
	export let address = '';

	const linkAddress = async (address_: string) => {
		// Get the nonce with the current address to sign the message
		const nonceResp = await (await postRequest('/api/get_nonce', { address })).json();
		if (!nonceResp.success) {
			const error = nonceResp.error.message;
			alert(error);
			return;
		}

		// Sign the message
		const messageToSign = createMessage(address, nonceResp.id);
		const signedMessage = await $signer.signMessage(messageToSign);

		// Request to link address
		const linkResp = await (
			await postRequest('/api/link_address', { address, signedMessage })
		).json();

		if (!linkResp.success) {
			alert('The address could not be linked to your account.');
			return;
		}

		isLinked.set(true);
		alert('Address linked to this account.');

		openedModal = false;
	};
</script>

<Modal bind:open={openedModal}>
	<div class="flex flex-col gap-5 w-min">
		<div class="flex flex-col gap-2.5 w-fit">
			<p class="text-[25px]">
				The connected wallet address {address} is not linked to your account.
			</p>
			<p>If you change your mind, you will be able to relink it again.</p>
		</div>
		<div class="flex gap-3.5">
			<Button variant="primary" on:click={() => linkAddress(address)}>Link wallet</Button>
			<Button variant="black" on:click={() => (openedModal = false)}>Cancel</Button>
		</div>
	</div>
</Modal>
