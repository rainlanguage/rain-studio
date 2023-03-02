<script lang="ts">
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import ContractCard from '$lib/contracts/ContractCard.svelte';

	$: contractsF = $page.data.contractsF;
</script>

<Background alignItems="items-start">
	<div class="container mx-auto flex py-8 px-4 sm:px-0">
		<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each contractsF as contractF}
				<a href={`/contracts/${contractF.slug}`}>
					<ContractCard {contractF} />
				</a>
			{/each}
		</div>
	</div>
</Background>
