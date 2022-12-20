<script lang="ts">
	import { Button, Modal } from 'rain-svelte-components/package';
	import { createMessage, postRequest, getMessage } from '$lib/utils';
	import { signer } from 'svelte-ethers-store';
	import { isLinked, unwantedWallets } from '.';

	import CommonModal from '$lib/CommonModal.svelte';
	import { ExclamationTriangle, CheckCircle } from '@steeze-ui/heroicons';

	export let openedModal = false;
	export let address = '';

	let modalSuccess = false;
	let modalError = false;
	let messageError = '';

	const linkAddress = async () => {
		const messageToSign = await getMessage(address);

		const signedMessage = await $signer.signMessage(messageToSign);

		// TODO: Use the new way to link with form actions and allow to cancel the link (the submit) using the same form enhance

		// // Request to link address
		// const linkResp = await (
		// 	await postRequest('/api/link_address', { address, signedMessage })
		// ).json();

		// if (!linkResp.success) {
		// 	openErrorModal('The address could not be linked to your account.');
		// 	return;
		// }

		// isLinked.set(true);
		openedModal = false;
		modalSuccess = true;
	};

	const closeMainModal = () => {
		if (!$unwantedWallets.includes(address)) {
			$unwantedWallets.push(address);
		}

		openedModal = false;
	};

	const openErrorModal = (errorMessag_: string) => {
		messageError = errorMessag_;
		openedModal = false;
		modalError = true;
	};
</script>

<Modal bind:open={openedModal}>
	<div class="flex flex-col gap-5 w-min">
		<div class="flex flex-col gap-2.5 w-fit">
			<p class="text-[25px]">The connected wallet is not linked to your account.</p>
			<p class="font-mono">{address}</p>
		</div>
		<div class="flex gap-3.5">
			<Button variant="primary" on:click={linkAddress}>Link wallet</Button>
			<Button variant="black" on:click={closeMainModal}>Cancel</Button>
		</div>
	</div>
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
