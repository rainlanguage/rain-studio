<script>
	import { page } from '$app/stores';
	import '../app.postcss';
	import { supabaseClient } from '$lib/supabaseClient';
	import { afterNavigate, beforeNavigate, invalidate } from '$app/navigation';
	import { afterUpdate, getContext, onMount, setContext } from 'svelte';
	import Nav from '$lib/nav/Nav.svelte';
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
	import Footer from '$lib/Footer.svelte';
	import { viewportWidth } from '$lib/breakpoint-stores';

	let openedModalLink = false;
	let _address = '';

	setContext('EVALUABLE_ADDRESSES', {
		getAddresses: async () => {
			const resp = await fetch(`/api/get_interpreters`, {
				method: 'GET'
			});
			if (resp.ok) {
				const { interpreterAddresses } = await resp.json();
				return interpreterAddresses;
			}

			return [];
		}
	});

	afterUpdate(async () => {
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

	beforeNavigate(() => {});

	afterNavigate(() => {});
</script>

<svelte:window bind:outerWidth={$viewportWidth} />

<ModalLinkAddress bind:openedModal={openedModalLink} address={$signerAddress} />

<div data-sveltekit-prefetch class="flex h-full min-h-screen flex-col">
	<Nav />
	<slot />
	{#if !$page.data?.noFooter}
		<Footer />
	{/if}
</div>

<SvelteToast />
