<script lang="ts">
	import { Section, SectionBody, SectionHeading } from 'rain-svelte-components/package/section';
	import SvelteMarkdown from 'svelte-markdown';
	import { getNameFromChainId } from './write';

	export let description: string, knownAddresses: string[], chainId: number;
</script>

<div class="whitespace-pre-line">
	<SvelteMarkdown source={description} />
</div>
<Section>
	<SectionHeading>Known addresses</SectionHeading>
	<SectionBody>
		<div class="flex flex-col text-sm">
			<table class="">
				<tr class="border-b border-gray-200 pb-2">
					<td class="pb-2">Network</td>
					<td class="pb-2">Chain id</td>
					<td class="pb-2">Address</td>
				</tr>
				{#if knownAddresses?.length}
					{#each knownAddresses as address}
						<tr>
							<td class="pt-3">{getNameFromChainId(chainId)}</td>
							<td class="pt-3">{chainId}</td>
							<td class="block w-48 truncate pt-3 md:w-full">{address}</td>
						</tr>
					{/each}
				{/if}
			</table>
		</div>
	</SectionBody>
</Section>
