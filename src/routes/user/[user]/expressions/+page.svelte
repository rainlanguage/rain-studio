<script lang="ts">
	import { page } from '$app/stores';
	import ExpressionSummaryRow from '$lib/expressions/ExpressionSummaryRow.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import { Plus } from '@steeze-ui/heroicons';
	import { Button, Select, Tab, TabList, TabPanel, Tabs } from 'rain-svelte-components/package';
	import autoAnimate from '@formkit/auto-animate';
	import { goto } from '$app/navigation';
	import DeployedExpressionSummaryRow from '$lib/expressions/DeployedExpressionSummaryRow.svelte';

	$: draftExpressions = $page.data?.draft_expressions;
	$: deployedExpressions = $page.data?.deployedExpressions;

	const removeExpression = (id: string) => {
		draftExpressions = draftExpressions.filter((expression: any) => expression.id !== id);
	};

	const refresh = async () => {
		if ($page.data.session && 'id' in $page.data.session.user) {
			const resp = await fetch(`/user/${$page.data.session.user.id}/expressions`, {
				method: 'POST'
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
		<Button
			variant="primary"
			on:click={() => {
				goto('/expression/new');
			}}
			icon={Plus}>New expression</Button
		>
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
						<div>
							<!-- <Select /> -->
						</div>
					</div>
					<div class="flex flex-row">
						<div class="w-1/5" />
						<div use:autoAnimate class="w-4/5 gap-y-4 flex-col flex">
							{#each draftExpressions as expression (expression.id)}
								<ExpressionSummaryRow
									{expression}
									on:deleted={() => {
										removeExpression(expression.id);
									}}
									on:saved={refresh}
								/>
							{/each}
							{#if !draftExpressions.length}
								<span class="text-xl text-gray-600 w-full text-center pt-8"
									>No saved expressions yet 🙁</span
								>
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
						{#each deployedExpressions as expression}
							<DeployedExpressionSummaryRow {expression} />
						{/each}
					</div>
				</div>
			</div>
		</TabPanel>
	</div>
</Tabs>
