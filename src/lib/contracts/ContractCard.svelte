<script lang="ts">
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { logoUrlRain, nameRain } from '$lib/utils/constants';
	import type { FormattedContract } from '$lib/utils/meta';
	import Pills from 'rain-svelte-components/package/Pills.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	export let contractF: FormattedContract;

	const addressCount = contractF.knownAddresses.length;
</script>

<div
	class="flex w-full cursor-pointer flex-col gap-y-2 rounded-2xl border border-gray-200 bg-white p-4 transition-transform hover:scale-105"
>
	<ProjectTag
		logoUrl={contractF.project?.logo_url ?? logoUrlRain}
		name={contractF.project?.name ?? nameRain}
	/>
	<span class="font-semibold">{contractF.name}</span>
	<!-- <Pills><span class="text-xs">{contract.metadata.type}</span></Pills> -->
	<span class="text-sm text-gray-600">
		{addressCount} known address{#if addressCount > 1}es{/if} on 1 chain
	</span>
	<span class="mt-2 h-24 overflow-clip text-sm text-gray-900">
		<SvelteMarkdown source={contractF.description} />
	</span>
</div>
