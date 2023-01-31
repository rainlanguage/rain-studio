<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import ExpressionRow from '$lib/expressions/ExpressionRow.svelte';
	import { copyAndEmit, flattenExpression } from '$lib/expressions/expressions';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import ModalChangeVisibilty from '$lib/expressions/ModalChangeVisibilty.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import {
		DocumentDuplicate,
		Eye,
		PaperAirplane,
		Pencil,
		Trash,
		LockOpen,
		LockClosed
	} from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import { OverflowMenu, OverflowMenuItem } from 'rain-svelte-components/package/overflow-menu';
	import type { ExpressionRowFull } from '$lib/types/types';
	import AuthInner from '$lib/AuthInner.svelte';

	export let expression: ExpressionRowFull;
	const dispatch = createEventDispatcher();

	let deleteExpressionModal = false,
		newExpModal = false,
		changeVisiblityModal = false;

	const deleteExp = () => {
		deleteExpressionModal = true;
	};

	const confirmDelete = async () => {
		const action = await supabaseClient
			.from('draft_expressions_w')
			.delete()
			.eq('id', expression.id);
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
			on:click={() => goto(`/expression/draft/${expression.sharable_slug}`)}
			size="small"
			variant="transparent"
			icon={Eye}>View</Button
		>
		<Button
			on:click={() => {
				goto(`/expression/draft/${expression.sharable_slug}/edit`);
			}}
			size="small"
			variant="transparent"
			icon={Pencil}>Edit</Button
		>
		<Button
			on:click={() => {
				copyAndEmit(
					`${$page.url.origin}/expression/draft/${expression.sharable_slug}/`,
					'Link copied to clipboard'
				);
			}}
			size="small"
			variant="transparent"
			icon={PaperAirplane}>Share</Button
		>
		<OverflowMenu position="right">
			{#if $page.data.session?.user?.id}
				<OverflowMenuItem
					on:click={() => (changeVisiblityModal = true)}
					icon={expression.public ? LockClosed : LockOpen}
				>
					Make {expression.public ? 'private' : 'public'}
				</OverflowMenuItem>
			{/if}
			<OverflowMenuItem on:click={() => (newExpModal = true)} icon={DocumentDuplicate}
				>Duplicate
			</OverflowMenuItem>
			<OverflowMenuItem on:click={deleteExp} classes="text-red-700" icon={Trash}
				>Delete
			</OverflowMenuItem>
		</OverflowMenu>
	</div>
</ExpressionRow>

<ModalChangeVisibilty on:visibilyChanged {expression} bind:isOpen={changeVisiblityModal} />

<Modal bind:open={deleteExpressionModal}>
	<div class="flex flex-col gap-y-2">
		<span class="text-2xl">Delete expression</span>
		<span>Are you sure you want to delete this expression? This can't be undone.</span>
		<div class="mt-4 flex gap-x-2">
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
		<ForkExpression expression={flattenExpression(expression)} on:saved />
	{:else}
		<AuthInner />
	{/if}
</Modal>
