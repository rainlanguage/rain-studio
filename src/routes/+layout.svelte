<script>
	import '../app.postcss';
	import { supabaseClient } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { afterUpdate, onMount } from 'svelte';
	import Nav from '$lib/Nav.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import * as Sentry from '@sentry/svelte';
	import { BrowserTracing } from '@sentry/tracing';
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
		// Initialize the Sentry SDK here
		Sentry.init({
			dsn: 'https://e384ab07b25a4be9afb4ed541f52c95a@o4504335130689536.ingest.sentry.io/4504335132393472',
			integrations: [new BrowserTracing()],

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 1.0
		});

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
