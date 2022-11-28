<script lang="ts">
	import { Section, SectionBody, SectionHeading } from 'rain-svelte-components/package/section';
	import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
	export let abi: any, metadata: ContractMetadata;

	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import { json, redirect } from '@sveltejs/kit';

	// Mock Data
	const recentlyDeployed: any[] = [];
	const name = 'EmissionsTKN (eTKN)';
	const user = '0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd';
	const time = '3 sec';
	const expression = '_: add(2 3)';
	for (let i = 0; i < 5; i++) {
		recentlyDeployed.push({
			name,
			user,
			time,
			expression
		});
	}

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
								<td class="pt-3">{chain.chainId}</td>
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

<Section>
	<SectionHeading>Recently deployed</SectionHeading>
	<SectionBody>
		{#each recentlyDeployed as deployedElement}
			<div class="border-b border-slate-300 pb-[10px]">
				<div class="text-[13px] mb-1">
					{deployedElement.name}
				</div>
				<div class="font-mono text-[12px] leading-[15.62px] bg-neutral-100 rounded-[5px]">
					<Formatter raw={deployedElement.expression} />
				</div>
				<div class="flex">
					<p>{deployedElement.time}</p>
					<p>{deployedElement.user}</p>
				</div>
			</div>
		{/each}
	</SectionBody>
</Section>
