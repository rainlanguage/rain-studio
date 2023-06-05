<script lang="ts">
	import KnownAddresses from '$lib/KnownAddresses.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { Pills } from '@rainprotocol/rain-svelte-components';
	import SvelteMarkdown from 'svelte-markdown';
	import { getChainsFromInterpreterAddresses } from '$lib/contracts';
	import { interpreterOptions } from '$lib/utils';

	export let interpreter: any;
	export let showDetailedInfo: boolean = false;

	$: chainsData = getChainsFromInterpreterAddresses(interpreter.addresses);
</script>

<div
	class="flex w-full cursor-pointer flex-col gap-y-2 rounded-2xl border border-gray-200 bg-white p-4 transition-transform hover:scale-105"
>
	<span class="font-semibold ">
		<p class="capitalize">
			{interpreter.type}
		</p>
	</span>
	<Pills><span class="text-xs">{interpreter.id}</span></Pills>
	<span class="text-sm text-gray-600" />
	<!-- <span class="mt-2 h-24 overflow-clip text-sm text-gray-900">
		<SvelteMarkdown source={contract.metadata.description} />
	</span> -->

	{#if showDetailedInfo}
		{#if chainsData.length}
			<div class="flex gap-x-1">
				{#each chainsData as chain}
					<span
						class="mt-3 self-center overflow-clip rounded-xl border border-gray-400 bg-gray-200 px-2 py-1 text-sm text-gray-900"
					>
						{chain.name}
					</span>
				{/each}
			</div>
		{:else}
			There are not addresses for this contract
		{/if}
	{/if}
</div>
