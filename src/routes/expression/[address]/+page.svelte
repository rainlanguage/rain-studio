<script lang="ts">
	// import { Formatter as RainlangFormatter } from '@rainprotocol/rainlang';
	import { Button, Modal } from '@rainprotocol/rain-svelte-components';
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { DocumentDuplicate, Heart } from '@steeze-ui/heroicons';
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import Formatter from '@rainprotocol/rain-svelte-components/formatter/Formatter.svelte';
	import Auth from '$lib/Auth.svelte';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import SocialButton from '$lib/SocialButton.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import AuthInner from '$lib/AuthInner.svelte';

	$: expression = $page.data.expression;
	$: user = $page.data.user;
	$: sgQuery = $page.data.sg;
	$: userLike = $page.data.userLike;

	$: expressionToFork = {
		...expression,
		raw_expression: null //RainlangFormatter.get(expression.stateConfig)
	};
	$: session = $page.data.session;

	const clickLike = async () => {
		if (session) {
			if (userLike) {
				const { error } = await supabaseClient
					.from('starred')
					.delete()
					.eq('user_id', session.user.id)
					.eq('address', sgQuery.id);

				if (!error) userLike = false;
			} else {
				const { error } = await supabaseClient.from('starred').insert({
					starred: 'address',
					address: sgQuery.id
				});

				if (!error) userLike = true;
			}
		} else {
			openSignInModal = true;
		}
	};

	let openNewExpModal: boolean = false,
		openSignInModal: boolean = false;
</script>

<PageHeader>
	<div class="container mx-auto flex w-full items-center justify-between">
		<div class="flex flex-col gap-y-2">
			<span class="text-sm text-gray-500">On-chain expression</span>
			<span class="font-mono text-xl">{sgQuery.id}</span>
			<div class="flex items-center gap-x-2">
				<span>Created by</span>
				<UserAvatar url={user?.avatar_url} />
				<span>{user?.username}</span>
			</div>
			<TimeAgo dateString={parseInt(sgQuery.event.timestamp) * 1000} />
		</div>
		<div class="flex gap-x-2">
			<SocialButton
				icon={Heart}
				iconSize={'16'}
				classes={'border rounded-[10px] border-neutral-300 px-2'}
				isActived={userLike}
				iconTheme={userLike ? 'solid' : ''}
				colorActive="red"
				on:click={clickLike}
			/>
			<Button
				on:click={() => {
					openNewExpModal = true;
				}}
				size="small"
				variant="transparent"
				icon={DocumentDuplicate}>Fork</Button
			>
		</div>
	</div>
</PageHeader>

<div class="container mx-auto">
	<div class="mt-8">
		<div class="grid grid-cols-2 gap-8 gap-y-4">
			<div class="flex flex-col gap-y-4">
				<div class="text-xl font-semibold">Writer's notes</div>
				<div class="whitespace-pre-line">
					{expression.notes || `The writer of this expression hasn't appended any metadata.`}
				</div>
				<div class="mt-4 flex flex-col items-start gap-y-2 border-t border-gray-200 pt-4">
					<ExpressionEnv {expression} />
				</div>
			</div>
			<div>
				<div class="flex w-full flex-col gap-y-4">
					<Formatter stateConfig={expression.stateConfig} />
				</div>
			</div>
		</div>
	</div>
</div>

<Modal bind:open={openNewExpModal}>
	{#if $page.data.session}
		<ForkExpression expression={expressionToFork} />
	{:else}
		<AuthInner />
	{/if}
</Modal>

<Modal bind:open={openSignInModal}><AuthInner /></Modal>
