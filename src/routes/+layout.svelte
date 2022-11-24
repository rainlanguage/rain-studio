<script>
	import '../app.postcss';
	import { supabaseClient } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Nav from '$lib/Nav.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';

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
</script>

<div data-sveltekit-prefetch class="min-h-screen flex flex-col">
	<Nav />
	<slot />
</div>

<SvelteToast />
