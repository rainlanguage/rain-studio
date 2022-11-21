<script lang="ts">
	import { page } from '$app/stores';
	import ExpressionSummaryRow from '$lib/expressions/ExpressionSummaryRow.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import { Plus } from '@steeze-ui/heroicons';
	import { Button, Select, Tab, TabList, TabPanel, Tabs } from 'rain-svelte-components/package';
	import autoAnimate from '@formkit/auto-animate';

	$: draftExpressions = $page.data?.draft_expressions;

	const removeExpression = (id: string) => {
		draftExpressions = draftExpressions.filter((expression: any) => expression.id !== id);
	};

	const refresh = async () => {
		const resp = await fetch(`/user/${$page.data.session.id}/expressions`, { method: 'POST' });
		if (resp.ok) {
			const { draft_expressions } = await resp.json();
			draftExpressions = draft_expressions;
		}
	};

	$: console.log(draftExpressions);
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
				{#if draftExpressions?.length}
					<Tab>Draft</Tab>
				{/if}
				<Tab>Deployed</Tab>
			</TabList>
		</div>
	</div>
	<div class="container flex mx-auto justify-stretch">
		{#if draftExpressions?.length}
			<TabPanel>
				<div class="container mx-auto gap-y-4 flex flex-col">
					<div class="flex justify-between w-full mt-6">
						<Button icon={Plus}>New expression</Button>
						<div>
							<Select />
						</div>
					</div>
					<div class="flex flex-row">
						<div class="w-96">filters</div>
						<div use:autoAnimate class="w-full gap-y-4 flex-col flex">
							{#each draftExpressions as expression (expression.id)}
								<ExpressionSummaryRow
									{expression}
									on:deleted={() => {
										removeExpression(expression.id);
									}}
									on:saved={refresh}
								/>
							{/each}
						</div>
					</div>
				</div>
			</TabPanel>
		{/if}
		<TabPanel />
	</div>
</Tabs>
