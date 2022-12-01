<script lang="ts">
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import { afterUpdate } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Ring } from 'rain-svelte-components/package';

	let name_type = '';
	let loading = true;

	$: result = $page.data.result;

	afterUpdate(() => {
		if (result) {
			name_type = result.resultSG?.__typename || result.resultDB?.type;
		}
		loading = false;
	});
</script>

<Background>
	<div
		class="bg-white rounded-xl p-8 border border-gray-200 -mt-20"
		in:fly={{ y: 20, duration: 1000 }}
	>
		{#if loading}
			<Ring size="30px" color="#000" />
		{:else if result}
			The search is {'AEIOU'.indexOf(name_type[0]) !== -1 ? `an ${name_type}` : `a ${name_type}`}
		{:else}
			There is no result from this search
		{/if}
	</div>
</Background>
