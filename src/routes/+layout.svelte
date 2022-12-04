<script>
	import '../app.postcss';
	import { supabaseClient } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { afterUpdate, onMount } from 'svelte';
	import Nav from '$lib/Nav.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import ModalLinkAddress from '$lib/connected-table/ModalLinkAddress.svelte';
	import { signerAddress, connected } from 'svelte-ethers-store';
	import {
		isLinked,
		unwantedWallets,
		SearchStatus,
		currentSearchStatus,
		isLinkedToOther,
		linkedWalllets
	} from '$lib/connected-table';

	let openedModalLink = false;
	let _address = '';

	afterUpdate(() => {
		if (_address != $signerAddress) {
			_address = $signerAddress;
		}
	});

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	$: if (
		$connected &&
		!$isLinked &&
		!$unwantedWallets.includes($signerAddress) &&
		$currentSearchStatus === SearchStatus.Finished &&
		!$isLinkedToOther &&
		!$linkedWalllets.includes($signerAddress) &&
		_address == $signerAddress
	) {
		openedModalLink = true;
	}
</script>

<ModalLinkAddress bind:openedModal={openedModalLink} address={$signerAddress} />

<div data-sveltekit-prefetch class="min-h-screen flex flex-col">
	<Nav />
	<slot />
</div>

<SvelteToast />
