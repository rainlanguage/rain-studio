<script lang="ts">
	import { page } from '$app/stores';
	import ContractRow from './ContractRow.svelte';

	$: contracts = $page.data.contract;
</script>

<div class="container mx-auto flex mt-10">
	<div class="w-1/3">filters</div>
	<div class="w-2/3 grid grid-cols-3">
		{#each contracts as contract}
			<ContractRow {contract} />
		{/each}
	</div>
</div>
<!-- <div class="w-full overflow-hidden">
	<pre>{JSON.stringify($page.data, null, 2)}</pre>
</div> -->
