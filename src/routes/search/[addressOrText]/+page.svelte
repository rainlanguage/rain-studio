<script lang="ts">
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import { fly } from 'svelte/transition';

	$: dataResult = $page.data.result;
</script>

<Background>
	<div
		class="bg-white rounded-xl p-8 border border-gray-200 -mt-20"
		in:fly={{ y: 20, duration: 1000 }}
	>
		{#if dataResult}
			The result is: {dataResult.__typename}
		{:else}
			There is no result from this search
		{/if}
	</div>
</Background>
