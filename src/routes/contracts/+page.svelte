<script lang="ts">
	import { page } from '$app/stores';
	import ContractCard from '$lib/contracts/ContractCard.svelte';
	import Background from '$lib/Background.svelte';
	import {
		FilterSet,
		FilterGroup,
		Input,
		Ring,
		Button
	} from '@rainprotocol/rain-svelte-components';
	import { debounce } from 'lodash-es';
	import { networkOptions } from '$lib/utils';
	import { ChevronLeft, ChevronRight } from '@steeze-ui/heroicons';

	$: contracts = $page.data.contract;
	$: counterContracts = $page.data.counterContracts;
	$: contractsL = Math.ceil(counterContracts / 52);

	const networkOptions_ = [{ label: 'All', value: -1 }].concat(networkOptions);

	// Inital value "default" all networks
	let selectedNetworks: Array<number> = [-1];

	let searchValue: string;
	let loading_: boolean = false;
	let offset_: number = 0;
	let indexSelected_: number = 0;

	const getContractsFiltered = async (searchValue_: string, selectedNetworks_: Array<number>) => {
		const resp = await fetch(`${$page.url.origin}/contracts`, {
			method: 'POST',
			body: JSON.stringify({
				searchValue: searchValue_,
				selectedNetworks: selectedNetworks_,
				offset_
			})
		});

		if (resp.ok) {
			const { contractsFiltered, counterFiltered } = await resp.json();

			contracts = contractsFiltered;
			counterContracts = counterFiltered;
		}
		loading_ = false;
	};

	// Use debounce instead of 'everyAfter' to avoid accumulative calls.
	const getContractsFilteredDebounced = debounce(getContractsFiltered, 250);

	const callFilterWithDebounce = (searchValue_: string, selectedNetworks_: Array<number>) => {
		loading_ = true;
		getContractsFilteredDebounced(searchValue_, selectedNetworks_);
	};

	const changePagination = (num_: number, single_?: 'prev' | 'next') => {
		const _minOffset = 0;
		const _maxOffset = (contractsL - 1) * 52;

		if (!single_) {
			offset_ = num_ * 52;
			indexSelected_ = num_;
		}

		if (single_ == 'prev') {
			const aux = offset_ - 52;

			if (aux < _minOffset) {
				offset_ = _minOffset;
			} else {
				offset_ = aux;
				indexSelected_ -= 1;
			}
		}

		if (single_ == 'next') {
			const aux = offset_ + 52;

			if (aux > _maxOffset) {
				offset_ = _maxOffset;
			} else {
				offset_ = aux;
				indexSelected_ += 1;
			}
		}
	};

	$: networkFilterToShow = () => {
		// If no network selected (component initialization) OR length is 1 and is -1 (which means)
		// `All` networks is selected because that option is exclusive
		if (!selectedNetworks || (selectedNetworks.length === 1 && selectedNetworks[0] === -1))
			return 'All';

		return selectedNetworks
			.map((item_) => networkOptions_.find((network_) => network_.value === item_)?.label)
			.join(', ');
	};

	$: searchValue, selectedNetworks, offset_, callFilterWithDebounce(searchValue, selectedNetworks);
</script>

<div class="m-2 flex w-3/4 flex-row gap-x-10 self-center">
	<div class="ml-4 w-3/4">
		<!-- If I write an address or name, should search with alls to find a match -->
		<Input placeholder="Search by contract name or address" bind:value={searchValue} />
		<div class="flex flex-col gap-x-4">
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
				options={networkOptions_}
				bind:value={selectedNetworks}
			/>
		</FilterGroup>
	</div>
</div>

<Background alignItems="items-start">
	<div class="container mx-auto flex py-8 px-4 sm:px-0 ">
		{#if contracts && contracts.length}
			<div class="flex flex-col gap-y-8 justify-self-center">
				<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each contracts as contract}
						<a href={`/contracts/${contract.slug}`}>
							<ContractCard {contract} showDetailedInfo />
						</a>
					{/each}
				</div>
				<div class="flex justify-center">
					<Button
						classes="text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
						dual={'left'}
						size="small"
						icon={ChevronLeft}
						on:click={() => changePagination(0, 'prev')}
					/>

					{#each Array(contractsL) as _, index}
						<button
							class={`disabled flex items-center border border-neutral-200 px-2 text-neutral-600 ${
								index == indexSelected_ ? 'bg-neutral-300' : 'hover:bg-neutral-200'
							}`}
							on:click={() => changePagination(index)}
							disabled={index == indexSelected_}
						>
							{index + 1}
						</button>
					{/each}

					<Button
						size="small"
						classes="text-neutral-600 border border-neutral-200 hover:bg-neutral-200"
						dual={'right'}
						icon={ChevronRight}
						iconPosition={'right'}
						on:click={() => changePagination(0, 'next')}
					/>
				</div>
			</div>
		{:else}
			<span class="w-full self-center pt-8 text-center text-xl text-gray-600"
				>Oops! None contract found 🙁</span
			>
		{/if}
	</div>
</Background>
