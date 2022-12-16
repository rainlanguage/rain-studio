<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import ExpressionRow from '$lib/expressions/ExpressionRow.svelte';
	import { copyAndEmit } from '$lib/expressions/expressions';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
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
	import { Icon } from '@steeze-ui/svelte-icon';

	export let expression: any;
	const dispatch = createEventDispatcher();

	let deleteExpressionModal: boolean = false,
		newExpModal: boolean = false,
		changeVisiblityModal: boolean = false;

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

	const changeVisibility = async () => {
		const action = await supabaseClient
			.from('draft_expressions')
			.update({ public: !expression.public })
			.eq('id', expression.id);

		if (action?.error) {
			alert(action.error);
		} else {
			changeVisiblityModal = false;
			dispatch('visibilyChanged');
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
		<OverflowMenu>
			{#if $page.data.session?.user?.id}
				<OverflowMenuItem>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="flex gap-x-2" on:click={() => (changeVisiblityModal = true)}>
						<span class="w-4">
							<Icon src={expression.public ? LockClosed : LockOpen} />
						</span>
						<span> Make {expression.public ? 'private' : 'public'} </span>
					</div>
				</OverflowMenuItem>
			{/if}
			<OverflowMenuItem>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="flex gap-x-2" on:click={() => (newExpModal = true)}>
					<span class="w-4">
						<Icon src={DocumentDuplicate} />
					</span>
					<span> Duplicate </span>
				</div>
			</OverflowMenuItem>
			<OverflowMenuItem>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="flex gap-x-2 text-red-700" on:click={deleteExp}>
					<span class="w-4">
						<Icon src={Trash} />
					</span>
					<span>Delete</span>
				</div>
			</OverflowMenuItem>
		</OverflowMenu>
	</div>
</ExpressionRow>

<Modal bind:open={changeVisiblityModal}>
	<div class="flex flex-col gap-y-2">
		<span class="text-2xl">Make {expression.public ? 'private' : 'public'}</span>
		{#if expression.public}
			<span> Are you sure you want to make private this expression? </span>
			<span> Other users will no longer be able to view or interact with it. </span>
		{:else}
			<span>Are you sure you want to make public this expression? </span>
			<span>
				It will become fully visible to other users and they will be able to interact with it.
			</span>
		{/if}
		<div class="flex gap-x-2 mt-4">
			<Button variant="primary" on:click={changeVisibility}>Change visibility</Button>
			<Button
				on:click={() => {
					changeVisiblityModal = false;
				}}>Cancel</Button
			>
		</div>
	</div>
</Modal>

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
