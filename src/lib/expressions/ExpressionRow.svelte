<script lang="ts">
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';

	export let expression: any;
</script>

<div class="flex flex-col xl:flex-row border border-gray-200 p-5 rounded-lg gap-x-4 gap-y-4 w-full">
	<div class="w-1/3 flex flex-col gap-y-3">
		<span class="text-xl font-medium">{expression?.name || 'Untitled'}</span>
		<!-- <TimeAgo dateString={expression.created_at} /> -->
		<span>{expression?.notes || 'No notes'}</span>
		<ExpressionEnv {expression} />
		<slot />
	</div>
	<div class="flex-grow h-full w-2/3">
		{#if expression.raw_expression}
			<Formatter raw={expression.raw_expression} />
		{/if}
		{#if expression.stateConfig}
			<Formatter stateConfig={expression.stateConfig} />
		{/if}
	</div>
</div>
