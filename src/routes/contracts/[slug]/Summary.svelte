<script lang="ts">
	import {
		Section,
		SectionBody,
		SectionHeading
	} from '@rainprotocol/rain-svelte-components/section';
	import type { ContractMetadata } from 'rain-metadata/type-definitions/contract';
	import { allChainsData } from 'svelte-ethers-store';
	import SvelteMarkdown from 'svelte-markdown';
	import type { ContractAddressRow } from '$lib/types/types';
	export let abi: any, metadata: ContractMetadata, contractAddresses: ContractAddressRow;
</script>

<div><SvelteMarkdown source={metadata.description} /></div>
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
				{#if contractAddresses}
					{#each contractAddresses as el}
						<!-- {#each chain.knownAddresses as knownAddress} -->
						<tr>
							<td class="pt-3"
								>{allChainsData.find((_chain) => _chain.chainId == el.chainId)?.name}</td
							>
							<td class="pt-3">{el.chainId}</td>
							<td class="block w-48 truncate pt-3 md:w-full">{el.address}</td>
						</tr>
						<!-- {/each} -->
					{/each}
				{/if}
			</table>
		</div>
	</SectionBody>
</Section>
