<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import ExpressionRow from '$lib/expressions/ExpressionRow.svelte';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import { DocumentDuplicate, Eye } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import { Formatter } from '@rainprotocol/rainlang';
	import { goto } from '$app/navigation';
	import AuthInner from '$lib/AuthInner.svelte';

	export let expression: any;
	$: expressionToFork = { ...expression, raw_expression: Formatter.get(expression.stateConfig) };
	let newExpModal: boolean = false;
</script>

<ExpressionRow {expression}>
	<div class="mt-4 flex gap-x-2">
		<Button
			on:click={() => (newExpModal = true)}
			size="small"
			variant="transparent"
			icon={DocumentDuplicate}>Fork</Button
		>
		<Button
			on:click={() => {
				goto(`/expression/${expression.sg.id}`);
			}}
			size="small"
			variant="transparent"
			icon={Eye}>View</Button
		>
	</div>
</ExpressionRow>

<Modal bind:open={newExpModal}>
	{#if $page.data.session}
		<ForkExpression expression={expressionToFork} on:saved />
	{:else}
		<AuthInner />
	{/if}
</Modal>
