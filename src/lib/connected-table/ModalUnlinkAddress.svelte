<script lang="ts">
	import { Button, Modal } from 'rain-svelte-components/package';
	import { signerAddress } from 'svelte-ethers-store';
	import { supabaseClient } from '$lib/supabaseClient';
	import { isLinked, unwantedWallets } from './';

	import CommonModal from '$lib/CommonModal.svelte';
	import { ExclamationCircle, CheckCircle } from '@steeze-ui/heroicons';

	export let openedModal = false;
	export let address = '';

	let modalSuccess = false;
	let modalError = false;
	let messageError = '';

	const unlinkAddress = async (address: string) => {
		let resp = await supabaseClient.from('wallets').delete().eq('address', address);

		if (resp?.error) {
			openErrorModal('The address could not be deleted from your profile.');
			// alert('The address could not be deleted from your profile.');
		} else if ($signerAddress == address) {
			isLinked.set(false);

			// Since was recently unlinked, this avoit show the link modal with this address until the session finish
			if (!$unwantedWallets.includes(address)) {
				$unwantedWallets.push(address);
			}
		}

		openedModal = false;
		modalSuccess = true;
	};

	const openErrorModal = (errorMessag_: string) => {
		messageError = errorMessag_;
		openedModal = false;
		modalError = true;
	};
</script>

<Modal bind:open={openedModal}>
	<div class="flex flex-col gap-5">
		<div class="flex flex-col gap-2.5">
			<p class="text-[25px]">Are you sure you want to unlink this wallet?</p>
			<p>If you change your mind, you will be able to relink it again.</p>
		</div>
		<div class="flex gap-3.5">
			<Button variant="primary" on:click={() => unlinkAddress(address)}>Unlink</Button>
			<Button variant="black" on:click={() => (openedModal = false)}>Cancel</Button>
		</div>
	</div>
</Modal>

<!-- Modal success -->
<CommonModal
	bind:open={modalSuccess}
	message="The address has been removed from this account."
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
