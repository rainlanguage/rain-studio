<script lang="ts">
	import { page } from '$app/stores';
	import ExpressionSummaryRow from '$lib/expressions/ExpressionSummaryRow.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import { Plus } from '@steeze-ui/heroicons';
	import { Button, Select, Tab, TabList, TabPanel, Tabs } from 'rain-svelte-components/package';

	$: draftExpressions = $page.data?.draft_expressions;
</script>

<PageHeader>
	<div class="h-full flex flex-col justify-center container mx-auto">
		<span class="text-2xl font-semibold">Expressions</span>
	</div>
</PageHeader>

<Tabs>
	<div class="bg-gray-100 w-full">
		<div class="container mx-auto ">
			<TabList>
				{#if draftExpressions.length}
					<Tab>Draft</Tab>
				{/if}
				<Tab>Deployed</Tab>
			</TabList>
		</div>
	</div>
	<div class="container flex mx-auto justify-stretch">
		{#if draftExpressions.length}
			<TabPanel>
				<div class="container mx-auto gap-y-4 flex flex-col">
					<div class="flex justify-between w-full mt-6">
						<Button icon={Plus}>New expression</Button>
						<div>
							<Select />
						</div>
					</div>
					<div class="flex">
						<div class="w-96">filters</div>
						<div class="flex-grow">
							{#each draftExpressions as expression}
								<ExpressionSummaryRow {expression} />
							{/each}
						</div>
					</div>
				</div>
			</TabPanel>
		{/if}
		<TabPanel />
	</div>
</Tabs>
