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
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';
	import { createEventDispatcher } from 'svelte';

	export let presaveExpression: PresaveExpression;
	export let forking: boolean = false;

	let error: string | null;
	let newSlug: string;

	const dispatch = createEventDispatcher();

	const saveExpression = async () => {
		error = null;
		const expression = {
			name: presaveExpression.name,
			notes: presaveExpression.notes,
			contract: presaveExpression.contract.id,
			interpreter: presaveExpression.interpreter.id,
			raw_expression: presaveExpression.raw_expression
		};
		const response = await supabaseClient.from('draft_expressions_w').insert(expression).select();
		if (response.status == 400) error = 'Something went wrong';
		if (response.status == 201 && response.data) {
			newSlug = response.data[0].sharable_slug;
			dispatch('saved');
		}
	};
</script>

<div class="flex w-screen max-w-2xl flex-col gap-y-4">
	{#if !newSlug}
		<span class="text-2xl font-semibold"
			>{#if forking}Fork this expression{:else}Save this expression{/if}</span
		>
		<ProjectTag
			name={presaveExpression.contract.project.name}
			logoUrl={presaveExpression.contract.project.logo_url}
		/>
		<Pills><span class="text-sm">{presaveExpression.interpreter.metadata.name}</span></Pills>
		<div class="max-h-80 overflow-y-scroll">
			<Formatter raw={presaveExpression.raw_expression} showFork={false} />
		</div>
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
