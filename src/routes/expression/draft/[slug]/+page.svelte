<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { DocumentDuplicate, Pencil } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Modal from 'rain-svelte-components/package/Modal.svelte';

	$: expression = $page.data.expression;
	$: user = $page.data.expression.user_id;
	$: contract = $page.data.expression.contract;
	$: interpreter = $page.data.expression.interpreter;

	let openNewExpModal: boolean = false;
	let openSignInModal: boolean = false;

	const fork = () => {
		if ($page.data.session) {
			openNewExpModal = true;
		} else {
			openSignInModal = true;
		}
	};
</script>

<PageHeader>
	<div class="w-full flex justify-between items-center container mx-auto">
		<div class="flex flex-col gap-y-2">
			<span class="text-sm text-gray-500">Draft expression</span>
			<span class="text-2xl font-medium">{expression.name}</span>
			<div class="flex items-center gap-x-2">
				<span>Created by</span>
				<UserAvatar url={user.avatar_url} />
				<span>{user.username}</span>
			</div>
			<TimeAgo dateString={expression.created_at} />
		</div>
		<div class="flex gap-x-2">
			<Button on:click={fork} size="small" variant="transparent" icon={DocumentDuplicate}
				>Fork</Button
			>
			{#if user.id == expression.user_id.id}
				<Button
					on:click={() => {
						goto(`/expression/draft/${expression.sharable_slug}/edit`);
					}}
					size="small"
					variant="transparent"
					icon={Pencil}>Edit</Button
				>
			{/if}
		</div>
	</div>
</PageHeader>

<div class="container mx-auto">
	<div class="mt-8">
		<div class="gap-y-4 grid grid-cols-2 gap-8">
			<div class="flex flex-col gap-y-4">
				<div class="font-semibold text-xl">Writer's notes</div>
				<div class="whitespace-pre-line">{expression.notes}</div>
				<div class="flex flex-col gap-y-2 border-t border-gray-200 pt-4 mt-4 items-start">
					<ExpressionEnv {expression} />
				</div>
			</div>
			<div>
				<div class="w-full flex flex-col gap-y-4">
					<Formatter raw={expression.raw_expression} />
				</div>
			</div>
		</div>
	</div>
</div>

<Modal bind:open={openNewExpModal}>
	<ForkExpression {expression} />
</Modal>

<Modal bind:open={openSignInModal}><Auth /></Modal>
