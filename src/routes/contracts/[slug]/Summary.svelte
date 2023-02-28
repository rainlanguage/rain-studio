<script lang="ts">
	import { Section, SectionBody, SectionHeading } from 'rain-svelte-components/package/section';
	import SvelteMarkdown from 'svelte-markdown';
	export let metadata: any;
</script>

<div class="whitespace-pre-line">
	<SvelteMarkdown source={metadata.description} />
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
				{#if metadata.addresses}
					{#each metadata.addresses as addresses}
						<tr>
							<!-- TODO: REMOVE HARDCODED -->
							<td class="pt-3">Mumbai</td>
							<td class="pt-3">80001</td>
							<td class="block w-48 truncate pt-3 md:w-full">{addresses}</td>
						</tr>
					{/each}
				{/if}
			</table>
		</div>
	</SectionBody>
</Section>
