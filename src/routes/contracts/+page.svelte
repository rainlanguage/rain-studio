<script lang="ts">
	import { page } from '$app/stores';
	import ContractCard from '$lib/contracts/ContractCard.svelte';
	import Background from '$lib/Background.svelte';

	$: contracts = $page.data.contract;
</script>

<Background alignItems="items-start">
	<div class="container mx-auto flex mt-10">
		<!-- <div class="w-1/3" /> -->
		<div class="w-full grid grid-cols-3 gap-4">
			{#each contracts as contract}
				<a href={`/contracts/${contract.slug}`}>
					<ContractCard {contract} />
				</a>
			{/each}
		</div>
	</div>
</Background>

<!-- <div class="w-full overflow-hidden">
	<pre>{JSON.stringify($page.data, null, 2)}</pre>
</div> -->
