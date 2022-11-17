<script context="module" lang="ts">
	import { fade } from 'svelte/transition';
	export type PresaveExpression = {
		interpreter: any;
		notes?: string;
		name?: string;
		raw_expression: string;
		contract: any;
	};
</script>

<script lang="ts">
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from 'rain-svelte-components/package';
	import Pills from 'rain-svelte-components/package/Pills.svelte';

	export let presaveExpression: PresaveExpression;

	let error: string | null;
	let newSlug: string;

	const saveExpression = async () => {
		error = null;
		const expression = {
			name: presaveExpression.name,
			notes: presaveExpression.notes,
			contract: presaveExpression.contract.id,
			interpreter: presaveExpression.interpreter.id,
			raw_expression: presaveExpression.raw_expression
		};
		const response = await supabaseClient.from('draft_expressions').insert(expression).select();
		if (response.status == 400) error = 'Something went wrong';
		if (response.status == 201 && response.data) newSlug = response.data[0].sharable_slug;
	};
</script>

<div class="flex flex-col gap-y-4 w-96">
	{#if !newSlug}
		<span class="text-2xl font-semibold">Save an expression</span>
		<span>{presaveExpression.raw_expression}</span>
		<ProjectTag
			name={presaveExpression.contract.project.name}
			logoUrl={presaveExpression.contract.project.logo_url}
		/>
		<Pills><span class="text-sm">{presaveExpression.interpreter.metadata.name}</span></Pills>
		<Input bind:value={presaveExpression.name}>
			<svelte:fragment slot="label">Name</svelte:fragment>
		</Input>
		<Input type="textarea" bind:value={presaveExpression.notes}>
			<svelte:fragment slot="label">Description</svelte:fragment>
		</Input>
		<div>
			<Button variant="primary" on:click={saveExpression}>Save expression</Button>
		</div>
	{:else}
		<div in:fade class="flex flex-col gap-y-4">
			<span class="text-2xl font-semibold">Saved to your library.</span>
			<a class="underline" target="_blank" href={`/expression/draft/${newSlug}`}>View and share</a>
		</div>
	{/if}
	{#if error}
		<span transition:fade class="text-red-600">{error}</span>
	{/if}
</div>
