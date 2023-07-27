<script lang="ts">
	import { Section, SectionBody, SectionHeading } from '@rainprotocol/rain-svelte-components';
	import SvelteMarkdown from 'svelte4-markdown';
	import type { ContractAddressRow } from '$lib/types/types';
	import { getChainName } from '$lib/utils';
	// import type { ContractMetadata } from 'rain-metadata/type-definitions/contract';

	export let metadata: any | null = null,
		contractAddresses: ContractAddressRow[];
	// abi: any = null;
	// metadata: ContractMetadata | null = null;
</script>

{#if metadata}
	<div><SvelteMarkdown source={metadata.description} /></div>
{/if}
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
					{#each contractAddresses as address_}
						<tr>
							<td class="pt-3">
								{getChainName(address_.chain_id)}
							</td>
							<td class="pt-3">{address_.chain_id}</td>
							<!-- <td class="block w-48 truncate pt-3 md:w-full"> -->
							<td class="block w-48 truncate pt-3 md:w-full">
								<div class="flex-column flex gap-x-1">
									<p>
										{address_.address}
									</p>
									{#if address_.type == 'proxy'}
										<p class="text-sm text-blue-500">(proxy)</p>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</table>
		</div>
	</SectionBody>
</Section>
