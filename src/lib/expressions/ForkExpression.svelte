<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Button } from '@rainprotocol/rain-svelte-components';
	import { createEventDispatcher } from 'svelte';
	import type { ExpressionInsert } from '$lib/types/types';
	import { saveExpressionCopy } from '$lib/expressions/expressions';
	import type { Database } from '$lib/types/generated-db-types';

	export let expression: ExpressionInsert;
	let error: string | null;
	let newSlug: string;

	const dispatch = createEventDispatcher();

	const saveExpression = async () => {
		error = null;
		let expressionCopy: ExpressionInsert;

		expressionCopy = {
			...expression,
			name: expression?.name || 'Untitled',
			notes: expression?.notes || ''
		};

		const response = await saveExpressionCopy(expressionCopy);
		if (response.status == 400) error = 'Something went wrong';
		if (response.status == 201 && response.data) {
			newSlug = response.data.sharable_slug;
			dispatch('saved');
		}
	};
</script>

<div class="flex w-full flex-col gap-y-4 md:max-w-lg">
	{#if !newSlug}
		<span class="text-2xl font-semibold">Fork this expression</span>
		<span>This will save a copy of this expression into your library.</span>
		<div>
			<Button variant="primary" on:click={saveExpression}>Fork</Button>
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
