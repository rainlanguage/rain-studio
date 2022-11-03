<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { Button } from 'rain-svelte-components/package';
	import AutoAbiFormSeparated from 'rain-svelte-components/package/auto-abi-form/AutoAbiFormSeparated.svelte';
	import Sidebar from './Sidebar.svelte';

	$: project = $page.data.contract.project;
	$: metadata = $page.data.contract.metadata;
	$: abi = $page.data.contract.abi;
	// $: console.log(project);
</script>

<PageHeader>
	<div class="flex flex-col container mx-auto h-full items-stretch">
		<div class="flex flex-col justify-center justify-self-stretch h-full gap-y-3">
			<ProjectTag logoUrl={project.logo_url} name={project.name} />
			<span class="font-semibold text-2xl">{metadata.name}</span>
			<div class="flex gap-x-2 items-center">
				<span class="bg-gray-300 rounded-full px-2 py-1 text-sm">{metadata.type}</span>
				<span class="text-gray-500">4 known addresses on 3 chains</span>
			</div>
		</div>
		<div>tabs</div>
	</div>
</PageHeader>
<div class="container flex mx-auto justify-stretch">
	<div class="w-2/3 flex flex-col pt-10 gap-y-8 pr-6">
		<div class="flex flex-col gap-y-3 max-w-prose">
			<span class="text-2xl">{metadata.name}</span>
			<span>{metadata.description}</span>
		</div>
		<AutoAbiFormSeparated abi={abi.abi} {metadata} />
		<div class="self-start">
			<Button variant="primary">Deploy {metadata.name}</Button>
		</div>
	</div>
	<div class="border-l border-gray-200 w-1/3"><Sidebar /></div>
</div>
<!-- <div class="w-full overflow-hidden">
	<pre>{JSON.stringify($page.data, null, 2)}</pre>
</div> -->
