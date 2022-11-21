<script lang="ts">
	import ProjectTag from '$lib/ProjectTag.svelte';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';

	export let expression: any;
</script>

<div class="flex flex-col xl:flex-row border border-gray-200 p-5 rounded-lg gap-x-4 gap-y-4 w-full">
	<div class="w-1/3 flex flex-col gap-y-3">
		<span class="text-xl font-medium">{expression.name}</span>
		<!-- <TimeAgo dateString={expression.created_at} /> -->
		<span>{expression.notes}</span>
		{#if expression.contract}
			<div class="flex gap-x-2 items-center text-sm">
				<ProjectTag
					name={expression.contract.project.name}
					logoUrl={expression.contract.project.logo_url}
				/>
				<span>{expression.contract.metadata.name}</span>
			</div>
		{/if}
		<Pills><span class="text-sm">{expression.interpreter.metadata.name}</span></Pills>
		<slot />
	</div>
	<div class="flex-grow h-full w-2/3">
		<Formatter raw={expression.raw_expression} />
	</div>
</div>
