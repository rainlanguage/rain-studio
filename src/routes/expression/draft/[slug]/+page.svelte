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
	import { DocumentDuplicate, Pencil, LockOpen, LockClosed, Heart } from '@steeze-ui/heroicons';
	import { Button, HoverTooltip } from 'rain-svelte-components/package';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import ModalChangeVisibilty from '$lib/expressions/ModalChangeVisibilty.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import SocialButton from '$lib/SocialButton.svelte';
	import { supabaseClient } from '$lib/supabaseClient';

	$: expression = $page.data.expression;
	$: user = $page.data.expression.user_id;
	$: contract = $page.data.expression.contract;
	$: interpreter = $page.data.expression.interpreter;
	$: tags = $page.data.expression?.tags;
	$: userLike = $page.data.expression?.userLike;

	let session = $page.data.session;
	let openNewExpModal: boolean = false;
	let openSignInModal: boolean = false;
	let changeVisiblityModal: boolean = false;

	const fork = () => {
		if (session) {
			openNewExpModal = true;
		} else {
			openSignInModal = true;
		}
	};

	const clickLike = async () => {
		if (session) {
			if (userLike) {
				const { error } = await supabaseClient
					.from('starred')
					.delete()
					.eq('user_id', session.user.id)
					.eq('foreign_key', expression.id);

				if (!error) userLike = false;
			} else {
				const { error } = await supabaseClient.from('starred').insert({
					starred: 'draft_expression',
					foreign_key: expression.id
				});

				if (!error) userLike = true;
			}
		} else {
			openSignInModal = true;
		}
	};
</script>

<PageHeader>
	<div
		class="container mx-auto flex w-full flex-col items-stretch justify-between gap-y-4 px-4 sm:px-0 lg:flex-row lg:items-center"
	>
		<div class="flex flex-col gap-y-2">
			<span class="text-sm text-gray-500">Draft expression</span>
			<div class="flex gap-x-1.5">
				<span class="text-2xl font-medium">{expression.name}</span>
				{#if session?.user.id == expression.user_id.id}
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
			{#if expression.public && expression.user_id.id != session?.user.id}
				<SocialButton
					icon={Heart}
					iconSize={'16'}
					classes={'border rounded-[10px] border-neutral-300 px-2'}
					isActived={userLike}
					iconTheme={userLike ? 'solid' : ''}
					colorActive="red"
					on:click={clickLike}
				/>
			{/if}
			<Button on:click={fork} size="small" variant="transparent" icon={DocumentDuplicate}
				>Fork</Button
			>
			{#if session?.user.id == expression.user_id.id}
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

<div class="container mx-auto px-4 sm:px-0">
	<div class="py-8">
		<div class="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-7">
			<div class="col-span-3 flex flex-col gap-y-4">
				<div class="text-xl font-semibold">Writer's notes</div>
				<div class="whitespace-pre-line">{expression.notes}</div>
				<ViewTags {tags} />
				<div class="mt-4 flex flex-col items-start gap-y-2 border-t border-gray-200 pt-4">
					<ExpressionEnv {expression} />
				</div>
			</div>
			<div class="col-span-4">
				<div class="flex w-full flex-col gap-y-4">
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
