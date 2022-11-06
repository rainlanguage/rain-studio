<script lang="ts">
	import KnownAddresses from '$lib/KnownAddresses.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';

	export let contract: any;
</script>

<a
	href={`/contracts/${contract.slug}`}
	class="p-4 rounded-2xl border-gray-200 border w-full hover:scale-105 transition-transform cursor-pointer"
>
	<div class="flex flex-col gap-y-2">
		<ProjectTag logoUrl={contract.project.logo_url} name={contract.project.name} />
		<span class="font-semibold">{contract.metadata.name}</span>
		<Pills><span class="text-xs">{contract.metadata.type}</span></Pills>
		<span class="text-sm text-gray-600"><KnownAddresses metadata={contract.metadata} /></span>
		<span class="text-sm text-gray-900 mt-2 overflow-clip h-24">
			{contract.metadata.description}
		</span>
	</div>
</a>
