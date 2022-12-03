<script lang="ts">
	import { Button, Modal } from 'rain-svelte-components/package';
	import { signerAddress } from 'svelte-ethers-store';
	import { supabaseClient } from '$lib/supabaseClient';
	import { isLinked } from './';

	export let openedModal = false;
	export let address = '';

	const unlinkAddress = async (address: string) => {
		let resp = await supabaseClient.from('wallets').delete().eq('address', address);

		if (resp?.error) {
			alert('The address could not be deleted from your profile.');
		} else if ($signerAddress == address) {
			isLinked.set(false);
		}

		openedModal = false;
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
