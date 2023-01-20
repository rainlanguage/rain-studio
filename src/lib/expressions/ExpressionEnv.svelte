<script lang="ts">
	import InterpreterTag from '$lib/InterpreterTag.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import type { ExpressionRowFull } from '$lib/types/types';

	export let expression: ExpressionRowFull;
	export let showProject: boolean = true;
	export let compact: boolean = false;
</script>

{#if expression.contract}
	{#if showProject}
		<ProjectTag
			name={expression.contract.project.name}
			logoUrl={expression.contract.project.logo_url}
		/>
	{/if}
	<div class={`${compact ? 'text-md' : 'text-xl'} flex items-center gap-x-2 flex-wrap`}>
		<span class="font-semibold">{expression.contract.metadata.name}</span>
		{#if expression.contract_expression}
			<div class={`${compact ? 'h-4' : 'h-8'} border-l-2 border-gray-700 -rotate-12`} />
			<span>{expression.contract_expression}</span>
		{/if}
	</div>
{:else}
	<div class="text-xl flex items-center gap-x-2 font-semibold">No contract</div>
{/if}
{#if expression.interpreter}
	<InterpreterTag interpreter={expression.interpreter} />
{/if}
