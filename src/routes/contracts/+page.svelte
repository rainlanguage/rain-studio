<script lang="ts">
	import { page } from '$app/stores';
	import ContractCard from '$lib/contracts/ContractCard.svelte';
	import Background from '$lib/Background.svelte';

	$: contracts = $page.data.contracts;
</script>

<Background alignItems="items-start">
	<div class="container mx-auto flex py-8 px-4 sm:px-0">
		<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each contracts as contract}
				<a href={`/contracts/${contract.slug}`}>
					<ContractCard {contract} />
				</a>
			{/each}
		</div>
	</div>
</Background>
