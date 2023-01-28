<script lang="ts">
	import AuthInner from './AuthInner.svelte';
	import { fly } from 'svelte/transition';
	import Background from '$lib/Background.svelte';
</script>

<Background>
	<div
		class="mx-2 -mt-20 w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 sm:mx-0"
		in:fly={{ y: 20, duration: 1000 }}
	>
		<AuthInner />
	</div>
</Background>
