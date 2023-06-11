<script lang="ts">
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import InterpreterCard from '$lib/interpreters/InterpreterCard.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import { interpreterOptions, networkOptions } from '$lib/utils';
	import {
		Button,
		FilterGroup,
		FilterSet,
		Input,
		Ring
	} from '@rainprotocol/rain-svelte-components';
	import { ChevronLeft, ChevronRight } from '@steeze-ui/heroicons';
	import { debounce } from 'lodash-es';

	$: interpreters = $page.data.interpreters;
	$: counterInterpreters = $page.data.counterInterpreters;
	$: interpretersLength = Math.ceil(counterInterpreters / 52);

	const networkOptions_ = [{ label: 'All', value: -1 }].concat(networkOptions);

	// Inital value "default"
	let selectedInterpreter: Array<string> = [''];
	let selectedNetworks: Array<number> = [-1];
	let searchValue: string;
	let loading_: boolean = false;
	let offset_: number = 0;
	let indexSelected_: number = 0;

	const getInterpreters = async (
		searchValue_: string,
		selectedNetworks_: Array<number>,
		selectedInterpreter_: Array<string>
	) => {
		loading_ = true;
		const resp = await fetch(`${$page.url.origin}/interpreters`, {
			method: 'POST',
			body: JSON.stringify({
				searchValue: searchValue_,
				selectedNetworks: selectedNetworks_,
				selectedInterpreter: selectedInterpreter_,
				offset_: indexSelected_
			})
		});

		if (resp.ok) {
			const { interpretersFiltered, counterFiltered } = await resp.json();

			interpreters = interpretersFiltered;
			counterInterpreters = counterFiltered;
		}
		loading_ = false;
	};

	// Use debounce instead of 'everyAfter' to avoid accumulative calls.
	const getInterpretersFilteredDebounced = debounce(getInterpreters, 250);

	const callFilterWithDebounce = (
		searchValue_: string,
		selectedNetworks_: Array<number>,
		selectedInterpreter_: Array<string>
	) => {
		loading_ = true;
		getInterpretersFilteredDebounced(searchValue_, selectedNetworks_, selectedInterpreter_);
	};

	const changePagination = (num_: number, single_?: 'prev' | 'next') => {
		const _minOffset = 0;
		const _maxOffset = (interpretersLength - 1) * 52;

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
		// `All` networks are selected because that option is exclusive
		if (!selectedNetworks || (selectedNetworks.length === 1 && selectedNetworks[0] === -1))
			return 'All';

		return selectedNetworks
			.map((item_) => networkOptions_.find((network_) => network_.value === item_)?.label)
			.join(', ');
	};

	$: interpreterFilterToShow = () => {
		// If no type selected (component initialization) OR length is 1 and is -1 (which means)
		// `All` the types are selected because that option is exclusive
		if (
			!selectedInterpreter ||
			(selectedInterpreter.length === 1 &&
				(selectedInterpreter[0] === '' || selectedInterpreter[0] === 'All'))
		)
			return 'All';

		return selectedInterpreter
			.map(
				(item_) => interpreterOptions.find((interpreter_) => interpreter_.value === item_)?.label
			)
			.join(', ');
	};

	$: searchValue,
		selectedNetworks,
		selectedInterpreter,
		offset_,
		callFilterWithDebounce(searchValue, selectedNetworks, selectedInterpreter);
</script>

<div class="m-2 flex w-3/4 flex-row gap-x-10 self-center">
	<div class="ml-4 w-3/4">
		<!-- If I write an address, should search with alls to find a match -->
		<Input placeholder="Search by address" bind:value={searchValue} />
		<div class="flex flex-col gap-x-4">
			<p class="mt-4">
				<strong>Networks:</strong>
				{networkFilterToShow()}
			</p>
			<p class="mt-4">
				<strong>Types:</strong>
				{interpreterFilterToShow()}
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
		<!-- Should filter by the contract type -->
		<FilterGroup name="Filter per type">
			<FilterSet
				defaultOption={1}
				exclusiveOptions={[0]}
				options={interpreterOptions}
				bind:value={selectedInterpreter}
			/>
		</FilterGroup>
	</div>
</div>

<div class="m-auto">
	<Background alignItems="items-start">
		<div class="container mx-auto flex py-8 px-4 sm:px-0 ">
			{#if interpreters && interpreters.length}
				<div class="flex flex-col gap-y-8 justify-self-center">
					<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{#each interpreters as interpreter}
							<a href={`/interpreters/${interpreter.type}/${interpreter.slug}`}>
								<InterpreterCard {interpreter} showDetailedInfo />
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

						{#each Array(interpretersLength) as _, index}
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
</div>

<div>
	<Button on:click={() => getInterpreters(searchValue, selectedNetworks, selectedInterpreter)}
		>Fetch</Button
	>
</div>
