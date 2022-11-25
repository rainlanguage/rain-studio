<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button } from 'rain-svelte-components/package';
	import { createEventDispatcher } from 'svelte';
	import type { ExpressionRowFull } from '$lib/types/types';
	import { saveExpressionCopy } from '$lib/expressions/expressions';

	export let expression: ExpressionRowFull;

	let error: string | null;
	let newSlug: string;

	const dispatch = createEventDispatcher();

	const saveExpression = async () => {
		error = null;
		const expressionCopy = {
			name: expression.name,
			notes: expression.notes,
			contract: expression.contract.id,
			interpreter: expression.interpreter.id,
			raw_expression: expression.raw_expression
		};
		const response = await saveExpressionCopy(expressionCopy);
		if (response.status == 400) error = 'Something went wrong';
		if (response.status == 201 && response.data) {
			newSlug = response.data.sharable_slug;
			dispatch('saved');
		}
	};
</script>

<div class="flex flex-col gap-y-4 w-screen max-w-2xl">
	{#if !newSlug}
		<span class="text-2xl font-semibold">Fork this expression</span>
		<span>This will save a copy of this expression into your libary.</span>
		<div>
			<Button variant="primary" on:click={saveExpression}>Save expression</Button>
		</div>
	{:else}
		<div in:fade class="flex flex-col gap-y-4">
			<span class="text-2xl font-semibold">Saved to your library.</span>
			<a class="underline" rel="noreferrer" target="_blank" href={`/expression/draft/${newSlug}`}
				>View and share</a
			>
		</div>
	{/if}
	{#if error}
		<span transition:fade class="text-red-600">{error}</span>
	{/if}
</div>
