<script lang="ts">
	import { Button, Modal } from '@rainprotocol/rain-svelte-components';
	import { isLinked, unwantedWallets } from '$lib/connected-table';
	import { enhance } from '$app/forms';
	import CommonModal from '$lib/CommonModal.svelte';
	import { ExclamationCircle, CheckCircle } from '@steeze-ui/heroicons';
	import { signerAddress } from 'svelte-wagmi';

	// Types
	import type { SubmitFunction } from '@sveltejs/kit/types';

	export let openedModal = false;
	export let address = '';

	let modalSuccess = false;
	let modalError = false;
	let messageError = '';

	const submitFunction: SubmitFunction = async () => {
		return async ({ result, update }) => {
			openedModal = false;
			if (result.type == 'success') {
				// Since was recently unlinked, this avoit show the link modal with this address until the session finish
				if (!$unwantedWallets.includes(address)) $unwantedWallets.push(address);
				if ($signerAddress == address) isLinked.set(false);
				modalSuccess = true;
			} else if (result.type == 'failure') {
				modalError = true;
				messageError = result.data?.message ?? 'Something happened, try again';
			} else if (result.type == 'error') {
				// An unexpected error happened
				console.log(result.error);
			}
			update();
		};
	};
</script>

<Modal bind:open={openedModal}>
	<form
		method="POST"
		action="/settings/wallets?/unlinkAddress"
		class="flex flex-col gap-5"
		use:enhance={submitFunction}
	>
		<div class="flex flex-col gap-2.5">
			<p class="text-[25px]">Are you sure you want to unlink this wallet?</p>
			<p>If you change your mind, you will be able to relink it again.</p>
		</div>

		<div class="flex gap-3.5">
			<input hidden name="address" bind:value={address} class="rounded-[10px] bg-gray-300 p-2" />
			<div class="flex gap-3.5">
				<Button type="submit" variant="primary">Unlink</Button>
				<Button type="button" variant="black" on:click={() => (openedModal = false)}>Cancel</Button>
			</div>
		</div>
	</form>
</Modal>

<!-- Modal success -->
<CommonModal
	bind:open={modalSuccess}
	message="The address has been removed from this account"
	icon={CheckCircle}
	iconColor="text-green-500"
/>

<!-- Modal error -->
<CommonModal
	bind:open={modalError}
	message={messageError}
	icon={ExclamationCircle}
	iconColor="text-yellow-500"
/>
