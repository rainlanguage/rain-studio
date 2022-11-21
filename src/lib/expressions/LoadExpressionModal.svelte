<script lang="ts">
	import { page } from '$app/stores';
	import ExpressionRow from '$lib/expressions/ExpressionRow.svelte';
	import ExpressionSummaryRow from '$lib/expressions/ExpressionSummaryRow.svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	let draftExpressions: any;

	$: console.log(draftExpressions);

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const resp = await fetch(`/user/${$page.data.session.id}/expressions`, { method: 'POST' });
		if (resp.ok) {
			const { draft_expressions } = await resp.json();
			draftExpressions = draft_expressions;
		}
	});
</script>

{#if draftExpressions}
	<div class="max-w-5xl gap-y-4 flex flex-col overflow-y-scroll max-h-[80vh] overflow-x-visible">
		{#each draftExpressions as expression}
			<div
				class="cursor-pointer"
				on:click={() => {
					dispatch('select', { expression });
				}}
			>
				<ExpressionRow {expression} />
			</div>
		{/each}
	</div>
{/if}
