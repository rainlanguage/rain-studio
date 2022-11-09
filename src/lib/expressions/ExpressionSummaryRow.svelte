<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import { DocumentDuplicate, PaperAirplane, Trash } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import Pills from 'rain-svelte-components/package/Pills.svelte';

	export let expression: any;
	console.log(expression);
</script>

<div class="flex flex-col xl:flex-row border border-gray-200 p-5 rounded-lg gap-x-4 gap-y-4">
	<div class="w-96 flex flex-col gap-y-3">
		<span class="text-xl font-medium">{expression.name}</span>
		<TimeAgo dateString={expression.created_at} />
		<span>{expression.notes}</span>
		<div class="flex gap-x-2 items-center text-sm">
			<ProjectTag
				name={expression.contract.project.name}
				logoUrl={expression.contract.project.logo_url}
			/>
			<span>{expression.contract.metadata.name}</span>
		</div>
		<Pills><span class="text-sm">{expression.interpreter.metadata.name}</span></Pills>
		<div class="mt-4 flex gap-x-2">
			<Button size="small" variant="transparent" icon={DocumentDuplicate}>Fork</Button>
			<Button
				on:click={() => {
					goto(`/expression/draft/${expression.sharable_slug}`);
				}}
				size="small"
				variant="transparent"
				icon={PaperAirplane}>Share</Button
			>
			<Button size="small" variant="transparent" icon={Trash}>Delete</Button>
		</div>
	</div>
	<div class="font-mono bg-gray-100 rounded-md p-2 text-sm flex-grow">
		{expression.raw_expression}
	</div>
</div>
