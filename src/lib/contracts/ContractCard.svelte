<script lang="ts">
	import KnownAddresses from '$lib/KnownAddresses.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	export let contract: any;
</script>

<div
	class="flex w-full cursor-pointer flex-col gap-y-2 rounded-2xl border border-gray-200 bg-white p-4 transition-transform hover:scale-105"
>
	<ProjectTag logoUrl={contract.project.logo_url} name={contract.project.name} />
	<span class="font-semibold">{contract.metadata.name}</span>
	<Pills><span class="text-xs">{contract.metadata.type}</span></Pills>
	<span class="text-sm text-gray-600"><KnownAddresses metadata={contract.metadata} /></span>
	<span class="mt-2 h-24 overflow-clip text-sm text-gray-900">
		<SvelteMarkdown source={contract.metadata.description} />
	</span>
</div>
