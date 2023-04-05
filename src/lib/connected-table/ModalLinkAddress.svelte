<script lang="ts">
	import { Button, Modal } from 'rain-svelte-components';
	import { getMessage } from '$lib/utils';
	import { signer } from 'svelte-ethers-store';
	import { isLinked, unwantedWallets } from '$lib/connected-table';
	import { enhance } from '$app/forms';
	import { ExclamationTriangle, CheckCircle } from '@steeze-ui/heroicons';
	import CommonModal from '$lib/CommonModal.svelte';

	// Types
	import type { SubmitFunction } from '@sveltejs/kit/types';

	export let openedModal = false;
	export let address = '';

	let modalSuccess = false;
	let modalError = false;
	let messageError = '';

	const submitFunction: SubmitFunction = async ({ data, cancel }) => {
		const messageToSign = await getMessage(address);
		let signedMessage = '';
		try {
			signedMessage = await $signer.signMessage(messageToSign);
		} catch (error) {
			// Search for this error instances (?).
			//@ts-expect-error
			if (error.code == 'ACTION_REJECTED') {
				openedModal = false;
				modalError = true;
				messageError = 'Request cancelled: It is necessary to sign with the address';
			}
			cancel();
		}

		data.set('signature', signedMessage);

		return async ({ result, update }) => {
			openedModal = false;
			if (result.type == 'success') {
				isLinked.set(true);
				modalSuccess = true;
			} else if (result.type == 'failure') {
				// The action failed. Like a verification
				modalError = true;
				messageError = result.data?.message ?? 'Something happened, try again';
			} else if (result.type == 'error') {
				// An unexpected error happened (server side or something else)
				console.log(result.error);
			}
			update();
		};
	};

	const closeMainModal = () => {
		if (!$unwantedWallets.includes(address)) {
			$unwantedWallets.push(address);
		}

		openedModal = false;
	};
</script>

<Modal bind:open={openedModal}>
	<form
		method="POST"
		action="/settings/wallets?/linkAddress"
		class="flex w-min flex-col gap-5"
		use:enhance={submitFunction}
	>
		<div class="flex w-fit flex-col gap-2.5">
			<p class="text-[25px]">The connected wallet is not linked to your account.</p>
			<p class="font-mono">{address}</p>
		</div>

		<div class="flex gap-3.5">
			<input hidden name="address" bind:value={address} class="rounded-[10px] bg-gray-300 p-2" />
			<Button type="submit" variant="primary">Link wallet</Button>
			<Button type="button" variant="black" on:click={closeMainModal}>Cancel</Button>
		</div>
	</form>
</Modal>

<!-- Modal success -->
<CommonModal
	bind:open={modalSuccess}
	message="The address has been linked to this account."
	icon={CheckCircle}
	iconColor="text-green-500"
/>

<!-- Modal error -->
<CommonModal
	bind:open={modalError}
	message={messageError}
	icon={ExclamationTriangle}
	iconColor="text-red-600"
/>
