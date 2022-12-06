<script lang="ts">
	import { Formatter as RainlangFormatter } from '@beehiveinnovation/rainlang';
	import { Button, Modal } from 'rain-svelte-components/package';
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { DocumentDuplicate } from '@steeze-ui/heroicons';
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Auth from '$lib/Auth.svelte';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';

	$: expression = $page.data.expression;
	$: user = $page.data.user;
	$: sgQuery = $page.data.sg;

	$: expressionToFork = {
		...expression,
		raw_expression: RainlangFormatter.get(expression.stateConfig)
	};

	let openNewExpModal: boolean = false;
</script>

<PageHeader>
	<div class="w-full flex justify-between items-center container mx-auto">
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
		<div class="gap-y-4 grid grid-cols-2 gap-8">
			<div class="flex flex-col gap-y-4">
				<div class="font-semibold text-xl">Writer's notes</div>
				<div class="whitespace-pre-line">
					{expression.notes || `The writer of this expression hasn't appended any metadata.`}
				</div>
				<div class="flex flex-col gap-y-2 border-t border-gray-200 pt-4 mt-4 items-start">
					<ExpressionEnv {expression} />
				</div>
			</div>
			<div>
				<div class="w-full flex flex-col gap-y-4">
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
		<Auth />
	{/if}
</Modal>