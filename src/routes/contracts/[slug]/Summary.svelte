<script lang="ts">
	import { Section, SectionBody, SectionHeading } from 'rain-svelte-components/package/section';
	import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
	export let abi: any, metadata: ContractMetadata;
</script>

<div>
	{metadata.description}
</div>
<Section>
	<SectionHeading>Known addresses</SectionHeading>
	<SectionBody>
		<div class="flex flex-col text-sm">
			<div class="grid grid-cols-3 pb-2">
				<span class="font-medium">Network</span>
				<span class="font-medium">Chain id</span>
				<span class="font-medium">Address</span>
			</div>
			{#if metadata.addresses}
				{#each metadata.addresses as chain}
					{#each chain.knownAddresses as knownAddress}
						<div class="border-t border-gray-200 grid grid-cols-3 py-2">
							<span>{chain.chainId}</span>
							<span>{chain.chainId}</span>
							<span>{knownAddress}</span>
						</div>
					{/each}
				{/each}
			{/if}
		</div>
	</SectionBody>
</Section>
