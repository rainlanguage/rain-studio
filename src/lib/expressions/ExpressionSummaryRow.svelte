<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import SaveExpression from '$lib/expressions/SaveExpression.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import { DocumentDuplicate, PaperAirplane, Trash } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';
	import { createEventDispatcher } from 'svelte';

	export let expression: any;
	const dispatch = createEventDispatcher();

	let deleteExpressionModal: boolean = false,
		newExpModal: boolean = false;

	const deleteExp = () => {
		deleteExpressionModal = true;
	};

	const confirmDelete = async () => {
		const action = await supabaseClient.from('draft_expressions').delete().eq('id', expression.id);
		if (action?.error) {
			alert(action.error);
		} else {
			deleteExpressionModal = false;
			dispatch('deleted');
		}
	};
</script>

<div class="flex flex-col xl:flex-row border border-gray-200 p-5 rounded-lg gap-x-4 gap-y-4 w-full">
	<div class="w-1/3 flex flex-col gap-y-3">
		<span class="text-xl font-medium">{expression.name}</span>
		<!-- <TimeAgo dateString={expression.created_at} /> -->
		<span>{expression.notes}</span>
		{#if expression.contract}
			<div class="flex gap-x-2 items-center text-sm">
				<ProjectTag
					name={expression.contract.project.name}
					logoUrl={expression.contract.project.logo_url}
				/>
				<span>{expression.contract.metadata.name}</span>
			</div>
		{/if}
		<Pills><span class="text-sm">{expression.interpreter.metadata.name}</span></Pills>
		<div class="mt-4 flex gap-x-2">
			<Button
				on:click={() => (newExpModal = true)}
				size="small"
				variant="transparent"
				icon={DocumentDuplicate}>Fork</Button
			>
			<Button
				on:click={() => {
					goto(`/expression/draft/${expression.sharable_slug}`);
				}}
				size="small"
				variant="transparent"
				icon={PaperAirplane}>Share</Button
			>
			<Button on:click={deleteExp} size="small" variant="transparent" icon={Trash}>Delete</Button>
		</div>
	</div>
	<div class="flex-grow h-full w-2/3">
		<Formatter raw={expression.raw_expression} />
	</div>
</div>

<Modal bind:open={deleteExpressionModal}>
	<div class="flex flex-col gap-y-2">
		<span class="text-2xl">Delete expression</span>
		<span>Are you sure you want to delete this expression? This can't be undone.</span>
		<div class="flex gap-x-2 mt-4">
			<Button variant="primary" on:click={confirmDelete}>Delete</Button><Button
				on:click={() => {
					deleteExpressionModal = false;
				}}>Cancel</Button
			>
		</div>
	</div>
</Modal>

<Modal bind:open={newExpModal}>
	{#if $page.data.session}
		<SaveExpression
			forking
			presaveExpression={{
				raw_expression: expression.raw_expression,
				contract: expression.contract,
				interpreter: {
					id: '761f3744-fe08-4e71-b38c-faaf7b447455',
					metadata: { name: 'Rainterpreter' }
				},
				name: expression.name,
				notes: expression.notes
			}}
			on:saved
		/>
	{:else}
		<Auth />
	{/if}
</Modal>
