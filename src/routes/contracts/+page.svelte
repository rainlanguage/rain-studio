<script lang="ts">
	import { page } from '$app/stores';
	import ContractCard from '$lib/contracts/ContractCard.svelte';
	import Background from '$lib/Background.svelte';
	import { FilterSet, FilterGroup, Input, Ring } from '@rainprotocol/rain-svelte-components';
	import { debounce } from 'lodash-es';
	import { networkOptions } from '$lib/utils';

	$: contracts = $page.data.contract;
	$: counterContracts = $page.data.counterContracts;
	$: contractsL = counterContracts / 52;

	// Inital value "default" all networks
	let selectedNetworks: Array<number> = [networkOptions[0].value];

	let searchValue: string;
	let loading_: boolean = false;

	const getContractsFiltered = async (searchValue_: string, selectedNetworks_: Array<number>) => {
		const resp = await fetch(`${$page.url.origin}/contracts`, {
			method: 'POST',
			body: JSON.stringify({
				searchValue: searchValue_,
				selectedNetworks: selectedNetworks_,
				// TODO: Add tracking offset for the pagination FE
				offset_: 0
			})
		});

		if (resp.ok) {
			({ contractsFiltered: contracts, counterFiltered: counterContracts } = await resp.json());
		}
		loading_ = false;
	};

	// Use debounce instead of 'everyAfter' to avoid accumulative calls.
	const getContractsFilteredDebounced = debounce(getContractsFiltered, 250);

	const callFilterWithDebounce = (searchValue_: string, selectedNetworks_: Array<number>) => {
		loading_ = true;
		getContractsFilteredDebounced(searchValue_, selectedNetworks_);
	};

	$: networkFilterToShow = () => {
		// If no network selected (component initialization) OR length is 1 and is -1 (which means)
		// `All` networks is selected because that option is exclusive
		if (!selectedNetworks || (selectedNetworks.length === 1 && selectedNetworks[0] === -1))
			return 'All';

		return selectedNetworks
			.map((item_) => networkOptions.find((network_) => network_.value === item_)?.label)
			.join(', ');
	};

	$: searchValue, selectedNetworks, callFilterWithDebounce(searchValue, selectedNetworks);
</script>

<div class="m-2 flex w-3/4 flex-row gap-x-10 self-center">
	<div class="ml-4 w-3/4">
		<!-- If I write an address or name, should search with alls to find a match -->
		<Input placeholder="Search by contract name or address" bind:value={searchValue} />
		<div class="flex gap-x-4">
			<p class="mt-4">
				<strong>Networks:</strong>
				{networkFilterToShow()}
			</p>
			{#if loading_}
				<div class="mt-3">
					<Ring size="30px" color="#cbd5e1" />
				</div>
			{/if}
		</div>
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
		{#if contracts && contracts.length}
			<div class="justify-self-center">
				<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each contracts as contract}
						<a href={`/contracts/${contract.slug}`}>
							<ContractCard {contract} showDetailedInfo />
						</a>
					{/each}
				</div>
				<div class="flex justify-center gap-x-2">
					Next page element:
					<p>{contractsL}</p>
				</div>
			</div>
		{:else}
			<span class="w-full self-center pt-8 text-center text-xl text-gray-600"
				>Oops! None contract found 🙁</span
			>
		{/if}
	</div>
</Background>
