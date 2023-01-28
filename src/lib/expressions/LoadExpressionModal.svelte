<script lang="ts">
	import { page } from '$app/stores';
	import ExpressionRow from '$lib/expressions/ExpressionRow.svelte';
	import type { ContractRowFull } from '$lib/types/types';
	import { createEventDispatcher, onMount } from 'svelte';

	let draftExpressions: any;
	export let contract: ContractRowFull;
	export let expressionComponentName: string;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const resp = await fetch(`/api/expressions?userId=${$page.data.session?.user.id}`, {
			method: 'POST',
			body: JSON.stringify({ selectedContract: contract.id, expressionComponentName })
		});
		if (resp.ok) {
			const { draft_expressions } = await resp.json();
			draftExpressions = draft_expressions;
		}
	});
</script>

{#if draftExpressions}
	<div class="flex max-h-[80vh] max-w-5xl flex-col gap-y-4 overflow-x-visible overflow-y-scroll">
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
