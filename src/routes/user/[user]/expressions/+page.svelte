<script lang="ts">
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import ExpressionSummaryRow from '$lib/expressions/ExpressionSummaryRow.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import { MagnifyingGlass, Plus } from '@steeze-ui/heroicons';
	import {
		Button,
		Input,
		Select,
		Tab,
		TabList,
		TabPanel,
		Tabs
	} from 'rain-svelte-components/package';
	import autoAnimate from '@formkit/auto-animate';
	import { goto } from '$app/navigation';
	import DeployedExpressionSummaryRow from '$lib/expressions/DeployedExpressionSummaryRow.svelte';
	import FilterGroup from 'rain-svelte-components/package/filter/FilterGroup.svelte';
	import FilterSet from 'rain-svelte-components/package/filter/FilterSet.svelte';
	import type { ContractRowFull, InterpreterRowFull } from '$lib/types/types';
	import { everyAfter } from '$lib/utils/everyAfter';

	let draftExpressions = $page.data?.draft_expressions;
	let deployedExpressions = $page.data?.deployedExpressions;
	let tags = $page.data?.tags;

	const contracts: ContractRowFull[] = $page.data.contracts;
	const interpreters: InterpreterRowFull[] = $page.data.interpreters;

	// sorting
	enum SortOptions {
		ByNewest,
		ByOldest
	}

	const sortOptions = [
		{ label: 'Newest first', value: SortOptions.ByNewest },
		{ label: 'Oldest first', value: SortOptions.ByOldest }
	];

	let selectedSortOption = SortOptions.ByNewest;

	// contract filters
	const contractOptions = [
		{ label: 'All', value: 'all' },
		{ label: 'No contract', value: 'no-contract' },
		...contracts.map((contract) => ({
			label: contract.metadata.name,
			value: contract.id
		}))
	];
	let selectedContract: string;

	// interpreter filters
	const interpreterOptions = interpreters.map((interpreter) => ({
		label: interpreter.metadata.name,
		value: interpreter.id
	}));
	let selectedInterpreter: string = null;
	// tag filters
	const tagOptions = tags
		? [
				{ label: 'All', value: 'all-tags' },
				...tags?.map((tag: string) => ({ label: tag, value: tag }))
		  ]
		: '';
	let selectedTags: string[] = [];

	// search value
	let searchValue: string = '';

	$: getDraftExpressions(
		selectedSortOption,
		selectedContract,
		selectedInterpreter,
		selectedTags,
		searchValue
	);

	const getDraftExpressions = everyAfter(
		async (
			selectedSortOption: SortOptions,
			selectedContract: string,
			selectedInterpreter: string,
			selectedTags: string[],
			searchValue: string
		) => {
			const order = selectedSortOption === SortOptions.ByOldest ? true : false;
			const resp = await fetch(
				`${$page.url.origin}/user/${$page.data.session?.user.id}/expressions`,
				{
					method: 'POST',
					body: JSON.stringify({
						order: ['created_at', { ascending: order }],
						selectedContract,
						selectedInterpreter,
						searchValue,
						selectedTags
					})
				}
			);
			if (resp.ok) ({ draft_expressions: draftExpressions } = await resp.json());
		}
	);

	const removeExpression = (id: string) => {
		draftExpressions = draftExpressions.filter((expression: any) => expression.id !== id);
	};

	const refresh = async () => {
		if ($page.data.session && 'id' in $page.data.session.user) {
			const resp = await fetch(`/user/${$page.data.session.user.id}/expressions`, {
				method: 'POST',
				body: JSON.stringify({ order: ['created_at', { ascending: false }] })
			});
			if (resp.ok) {
				const { draft_expressions } = await resp.json();
				draftExpressions = draft_expressions;
			}
		}
	};
</script>

<PageHeader>
	<div class="h-full flex flex-row justify-between items-center container mx-auto">
		<span class="text-2xl font-semibold">Expressions</span>
	</div>
</PageHeader>

<Tabs>
	<div class="bg-gray-100 w-full">
		<div class="container mx-auto ">
			<TabList>
				{#if $page.data.currentUser}
					<Tab>Draft</Tab>
				{/if}
				<Tab>Deployed</Tab>
			</TabList>
		</div>
	</div>
	<div class="container flex mx-auto justify-stretch">
		{#if $page.data.currentUser}
			<TabPanel>
				<div class="container mx-auto gap-y-4 flex flex-col">
					<div class="flex justify-between w-full mt-6">
						<Button
							on:click={() => {
								goto('/expression/new');
							}}
							icon={Plus}>New expression</Button
						>
						<div>
							<Select items={sortOptions} bind:value={selectedSortOption} />
						</div>
					</div>
					<div class="flex flex-row gap-x-4">
						<div class="w-1/4">
							<FilterGroup name="Contract">
								<FilterSet exclusive options={contractOptions} bind:value={selectedContract} />
							</FilterGroup>
							<FilterGroup name="Interpreter">
								<FilterSet
									exclusive
									options={interpreterOptions}
									bind:value={selectedInterpreter}
								/>
							</FilterGroup>
							{#if tags}
								<FilterGroup name="Tags">
									<FilterSet
										options={tagOptions}
										bind:value={selectedTags}
										exclusiveOptions={[0]}
									/>
								</FilterGroup>
							{/if}
							<div class="mt-6 flex flex-col gap-y-2">
								<Input
									bind:value={searchValue}
									debounce
									debounceTime={100}
									icon={MagnifyingGlass}
									placeholder="Search your expressions"
								/>
								{#if searchValue}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<span
										transition:fade
										on:click={() => {
											searchValue = '';
										}}
										class="underline self-end text-sm cursor-pointer">Clear search</span
									>
								{/if}
							</div>
						</div>
						<div class="w-3/4 gap-y-4 flex-col flex">
							{#each draftExpressions as expression (expression.id)}
								<div in:fade>
									<ExpressionSummaryRow
										{expression}
										on:deleted={() => {
											removeExpression(expression.id);
										}}
										on:saved={refresh}
									/>
								</div>
							{/each}
							{#if !draftExpressions.length}
								<span class="text-xl text-gray-600 w-full text-center pt-8">None found 🙁</span>
							{/if}
						</div>
					</div>
				</div>
			</TabPanel>
		{/if}
		<TabPanel>
			<div class="container mx-auto gap-y-4 flex flex-col">
				<div class="flex justify-between w-full mt-6">
					<div />
				</div>
				<div class="flex flex-row">
					<div class="w-1/5" />
					<div use:autoAnimate class="w-4/5 gap-y-4 flex-col flex">
						{#if deployedExpressions}
							{#each deployedExpressions as expression}
								<DeployedExpressionSummaryRow {expression} />
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</TabPanel>
	</div>
</Tabs>
