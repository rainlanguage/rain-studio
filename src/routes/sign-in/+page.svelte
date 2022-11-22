<script>
	import { fly } from 'svelte/transition';
	import Auth from '$lib/Auth.svelte';
	import Background from '$lib/Background.svelte';
</script>

<Background>
	<div
		class="bg-white rounded-xl p-8 border border-gray-200 -mt-20"
		in:fly={{ y: 20, duration: 1000 }}
	>
		<Auth />
	</div>
</Background>
