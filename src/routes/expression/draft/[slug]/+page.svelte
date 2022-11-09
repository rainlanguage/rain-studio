<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
	import { DocumentDuplicate, PaperAirplane, Trash } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';

	$: expression = $page.data.expression;
</script>

<PageHeader>
	<div class="w-full flex justify-between items-center container mx-auto">
		<div class="flex flex-col gap-y-2">
			<span class="text-sm text-gray-500">Draft expression</span>
			<span class="text-2xl font-medium">{expression.name}</span>
		</div>
		<div class="flex gap-x-2">
			<Button size="small" variant="transparent" icon={DocumentDuplicate}>Fork</Button>
		</div>
	</div>
</PageHeader>

<div class="container mx-auto">
	<div class="mt-8">
		<div class="gap-y-4 flex flex-col max-w-prose">
			<span>{expression.notes}</span>
			<div class="p-4 rounded-md bg-gray-100">
				{expression.raw_expression}
			</div>
		</div>
	</div>
</div>
