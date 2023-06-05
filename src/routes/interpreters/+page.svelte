<script lang="ts">
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import { networkOptions } from '$lib/utils';
	import {
		Button,
		FilterGroup,
		FilterSet,
		Input,
		Ring
	} from '@rainprotocol/rain-svelte-components';

	const interpreterOptions = [
		{ label: 'All', value: -1 },
		{ label: 'Expression Deployers', value: 'deployers' },
		{ label: 'Rainterpreters', value: 'rainterpreters' },
		{ label: 'Stores', value: 'stores' }
	];
	const networkOptions_ = [{ label: 'All', value: -1 }].concat(networkOptions);

	// Inital value "default"
	let selectedInterpreter: Array<string> = [''];
	let selectedNetworks: Array<number> = [-1];
	let searchValue: string;
	let loading_: boolean = false;

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
				offset_: 0
			})
		});

		if (resp.ok) {
			const data_ = await resp.json();
			console.log(data_);
		}
		loading_ = false;
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
		if (!selectedInterpreter || (selectedInterpreter.length === 1 && selectedInterpreter[0] === ''))
			return 'All';

		return selectedInterpreter
			.map(
				(item_) => interpreterOptions.find((interpreter_) => interpreter_.value === item_)?.label
			)
			.join(', ');
	};
</script>

Interpreters
<div>
	<Button on:click={() => getInterpreters(searchValue, selectedNetworks, selectedInterpreter)}
		>Fetch</Button
	>
</div>

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
