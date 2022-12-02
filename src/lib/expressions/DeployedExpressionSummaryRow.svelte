<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import ExpressionRow from '$lib/expressions/ExpressionRow.svelte';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import { DocumentDuplicate } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import { Formatter } from '@beehiveinnovation/rainlang';

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
	</div>
</ExpressionRow>

<Modal bind:open={newExpModal}>
	{#if $page.data.session}
		<ForkExpression expression={expressionToFork} on:saved />
	{:else}
		<Auth />
	{/if}
</Modal>
