<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import ViewTags from '$lib/ViewTags.svelte';
	import { DocumentDuplicate, Pencil, LockOpen, LockClosed } from '@steeze-ui/heroicons';
	import { Button, HoverTooltip } from 'rain-svelte-components/package';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import ModalChangeVisibilty from '$lib/expressions/ModalChangeVisibilty.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';

	$: expression = $page.data.expression;
	$: user = $page.data.expression.user_id;
	$: contract = $page.data.expression.contract;
	$: interpreter = $page.data.expression.interpreter;
	$: tags = $page.data.expression?.tags;

	let openNewExpModal: boolean = false;
	let openSignInModal: boolean = false;
	let changeVisiblityModal: boolean = false;

	const fork = () => {
		if ($page.data.session) {
			openNewExpModal = true;
		} else {
			openSignInModal = true;
		}
	};

	console.log($page.data.session?.user.id);
</script>

<PageHeader>
	<div class="w-full flex justify-between items-center container mx-auto">
		<div class="flex flex-col gap-y-2">
			<span class="text-sm text-gray-500">Draft expression</span>
			<div class="flex gap-x-1.5">
				<span class="text-2xl font-medium">{expression.name}</span>
				{#if $page.data.session?.user.id == expression.user_id.id}
					<div class="w-5">
						<HoverTooltip
							placeHolder={`This expression is ${expression.public ? 'public' : 'private'}`}
						>
							<Icon src={expression.public ? LockOpen : LockClosed} />
						</HoverTooltip>
					</div>
				{/if}
			</div>
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
			{#if $page.data.session?.user.id == expression.user_id.id}
				<Button
					on:click={() => {
						changeVisiblityModal = true;
					}}
					size="small"
					variant="transparent"
					icon={expression.public ? LockClosed : LockOpen}
					>Make {expression.public ? 'private' : 'public'}
				</Button>
			{/if}
		</div>
	</div>
</PageHeader>

<div class="container mx-auto">
	<div class="mt-8">
		<div class="gap-y-4 grid grid-cols-7 gap-8">
			<div class="flex flex-col gap-y-4 col-span-3">
				<div class="font-semibold text-xl">Writer's notes</div>
				<div class="whitespace-pre-line">{expression.notes}</div>
				<span class="font-semibold">Tags</span>
				<ViewTags {tags} />
				<div class="flex flex-col gap-y-2 border-t border-gray-200 pt-4 mt-4 items-start">
					<ExpressionEnv {expression} />
				</div>
			</div>
			<div class="col-span-4">
				<div class="w-full flex flex-col gap-y-4">
					<Formatter raw={expression.raw_expression} />
				</div>
			</div>
		</div>
	</div>
</div>

<ModalChangeVisibilty
	{expression}
	bind:isOpen={changeVisiblityModal}
	on:visibilyChanged={() => {
		expression.public = !expression.public;
	}}
/>

<Modal bind:open={openNewExpModal}>
	<ForkExpression {expression} />
</Modal>

<Modal bind:open={openSignInModal}><Auth /></Modal>
