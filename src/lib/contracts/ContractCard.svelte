<script lang="ts">
	import KnownAddresses from '$lib/KnownAddresses.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { Pills } from '@rainprotocol/rain-svelte-components';
	import SvelteMarkdown from 'svelte-markdown';

	export let contract: any;
	export let showDetailedInfo: boolean = false;
</script>

<div
	class="flex w-full cursor-pointer flex-col gap-y-2 rounded-2xl border border-gray-200 bg-white p-4 transition-transform hover:scale-105"
>
	{#if contract.project}
		<ProjectTag logoUrl={contract.project.logo_url} name={contract.project.name} />
	{/if}
	<span class="font-semibold">{contract.metadata.name}</span>
	<!-- <Pills><span class="text-xs">{contract.type}</span></Pills> -->
	<Pills><span class="text-xs">{contract.id}</span></Pills>
	<span class="text-sm text-gray-600">
		<!-- <KnownAddresses metadata={contract.metadata} /> -->
	</span>
	<span class="mt-2 h-24 overflow-clip text-sm text-gray-900">
		<SvelteMarkdown source={contract.metadata.description} />
	</span>

	{#if showDetailedInfo}
		<span
			class="mt-3 self-center overflow-clip rounded-xl border border-gray-400 bg-gray-200 px-2 py-1 text-sm text-gray-900"
		>
			<KnownAddresses contract_addresses={contract.contract_addresses_new} />
		</span>
	{/if}
</div>
