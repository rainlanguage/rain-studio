<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import ExpressionRow from '$lib/expressions/ExpressionRow.svelte';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import SaveExpression from '$lib/expressions/SaveExpression.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import { DocumentDuplicate, PaperAirplane, Pencil, Trash } from '@steeze-ui/heroicons';
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

<ExpressionRow {expression}>
	<div class="mt-4 flex gap-x-2">
		<Button
			on:click={() => (newExpModal = true)}
			size="small"
			variant="transparent"
			icon={DocumentDuplicate}>Duplicate</Button
		>
		<Button
			on:click={() => {
				goto(`/expression/draft/${expression.sharable_slug}/edit`);
			}}
			size="small"
			variant="transparent"
			icon={Pencil}>Edit</Button
		>
		<Button on:click={deleteExp} size="small" variant="transparent" icon={Trash}>Delete</Button>
	</div>
</ExpressionRow>

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
		<ForkExpression {expression} on:saved />
	{:else}
		<Auth />
	{/if}
</Modal>
