<script lang="ts">
	import { Section, SectionBody, SectionHeading } from 'rain-svelte-components/package/section';
	import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
	import { allChainsData } from 'svelte-ethers-store';
	export let abi: any, metadata: ContractMetadata;

	import { json, redirect } from '@sveltejs/kit';
</script>

<div>
	{metadata.description}
</div>
<Section>
	<SectionHeading>Known addresses</SectionHeading>
	<SectionBody>
		<div class="flex flex-col text-sm">
			<table class="">
				<tr class="pb-2 border-b border-gray-200">
					<td class="pb-2">Network</td>
					<td class="pb-2">Chain id</td>
					<td class="pb-2">Address</td>
				</tr>
				{#if metadata.addresses}
					{#each metadata.addresses as chain}
						{#each chain.knownAddresses as knownAddress}
							<tr>
								<td class="pt-3"
									>{allChainsData.find((_chain) => _chain.chainId == chain.chainId)?.name}</td
								>
								<td class="pt-3">{chain.chainId}</td>
								<td class="truncate pt-3">{knownAddress}</td>
							</tr>
						{/each}
					{/each}
				{/if}
			</table>
		</div>
	</SectionBody>
</Section>
