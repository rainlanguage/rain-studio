<script lang="ts">
	import InterpreterTag from '$lib/InterpreterTag.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import type { ExpressionRowFull } from '$lib/types/types';

	export let expression: ExpressionRowFull;
</script>

{#if expression.contract}
	<ProjectTag
		name={expression.contract.project.name}
		logoUrl={expression.contract.project.logo_url}
	/>
	<div class="text-xl flex items-center gap-x-2 flex-wrap">
		<span class="font-semibold">{expression.contract.metadata.name}</span>
		{#if expression.contract_expression}
			<div class="h-8 border-l-2 border-gray-300 -rotate-12" />
			<span>{expression.contract_expression}</span>
		{/if}
	</div>
{:else}
	<div class="text-xl flex items-center gap-x-2 font-semibold">No contract</div>
{/if}
{#if expression.interpreter}
	<InterpreterTag interpreter={expression.interpreter} />
{/if}
