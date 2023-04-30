<script lang="ts">
	import { page } from '$app/stores';
	import ContractCard from '$lib/contracts/ContractCard.svelte';
	import Background from '$lib/Background.svelte';
	import { ethers } from 'ethers';
	import { FilterSet, FilterGroup, Input, Button } from '@rainprotocol/rain-svelte-components';

	import { everyAfter } from '$lib/utils/everyAfter';
	import { supabaseClient } from '$lib/supabaseClient';

	$: contracts = $page.data.contract;

	const networkOptions = [
		{ label: 'All', value: -1 },
		{ label: 'Polygon', value: 137 },
		{ label: 'Mumbai', value: 80001 }
	];

	// Inital value "default" all networks
	let selectedNetworks: Array<number> = [networkOptions[0].value];

	let searchValue: string;

	const getContractsFiltered = everyAfter(
		async (searchValue_: string, selectedNetworks_: Array<number>) => {
			const resp = await fetch(`${$page.url.origin}/contracts`, {
				method: 'POST',
				body: JSON.stringify({
					searchValue: searchValue_,
					selectedNetworks: selectedNetworks_
				})
			});

			if (resp.ok) {
				({ contractsFiltered: contracts } = await resp.json());
			}
		}
	);

	$: networkFilterToShow = () => {
		// If no network selected (component initialization) OR length is 1 and is -1 (which means)
		// `All` networks is selected because that option is exclusive
		if (!selectedNetworks || (selectedNetworks.length === 1 && selectedNetworks[0] === -1))
			return 'All';

		return selectedNetworks
			.map((item_) => networkOptions.find((network_) => network_.value === item_)?.label)
			.join(', ');
	};

	$: getContractsFiltered(searchValue, selectedNetworks);
</script>

<div class="m-2 flex w-3/4 flex-row gap-x-10 self-center">
	<div class="ml-4 w-3/4">
		<!-- If I write an address or name, should search with alls to find a match -->
		<Input placeholder="Search a contract" bind:value={searchValue} />
		<p class="mt-4 w-full">
			<strong>Networks:</strong>
			{networkFilterToShow()}
		</p>
	</div>

	<div class="w-1/4">
		<!-- Should filter by Network -->
		<FilterGroup name="Filter per network">
			<!-- DefaultOption = 1 => true -->
			<FilterSet
				defaultOption={1}
				exclusiveOptions={[0]}
				options={networkOptions}
				bind:value={selectedNetworks}
			/>
		</FilterGroup>
	</div>
</div>

<Background alignItems="items-start">
	<div class="container mx-auto flex py-8 px-4 sm:px-0">
		<!-- <div class="w-1/3" /> -->
		<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each contracts as contract}
				<a href={`/contracts/${contract.slug}`}>
					<ContractCard {contract} showDetailedInfo />
				</a>
			{/each}
		</div>
	</div>
</Background>
