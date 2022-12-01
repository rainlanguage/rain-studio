<script lang="ts">
	import type { Expression } from 'rain-metadata/metadata-types/contract';
	import { HoverTooltip } from 'rain-svelte-components/package';

	export let contextColumns: Expression['contextColumns'];

	let maxRows = contextColumns?.length
		? Math.max(...contextColumns.map((column) => (column?.cells ? column.cells?.length : 0)))
		: 0;

	export let mockContext = Array(contextColumns?.length)
		.fill(0)
		.map((arr) => Array(maxRows));

	let columns = contextColumns?.length || 0;
</script>

{#if contextColumns}
	<div class="uppercase text-xs text-gray-500 pt-4 pb-2">Context</div>

	<table class={`text-sm border border-gray-300`}>
		<tr class="border-gray-300 border-b">
			{#each Array(columns) as col, y}
				<td class="p-1 text-xs font-medium cell bg-gray-100">{contextColumns[y].name}</td>
			{/each}
		</tr>
		{#each Array(maxRows) as row, y}
			<tr class="border-gray-300 border-b">
				{#each Array(columns) as col, x}
					<td class="p-2 border-gray-300 border-r">
						<HoverTooltip width="w-48" class="bg-white flex flex-col">
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class="flex flex-col">
								<span class="font-mono text-gray-400 text-xs">{`<${x} ${y}>`}</span>
								{#if contextColumns?.[x]?.cells?.[y].alias}
									<span class="font-mono whitespace-nowrap"
										>{contextColumns[x]?.cells?.[y].alias}</span
									>
									<input
										class="text-gray-700 bg-gray-100 p-1"
										placeholder="..."
										bind:value={mockContext[x][y]}
									/>
								{:else}
									<span class="text-gray-300">empty</span>
								{/if}
							</div>
							<span slot="tip"
								>{contextColumns?.[x]?.cells?.[y].description ||
									contextColumns?.[x]?.cells?.[y].name ||
									'Empty'}</span
							>
						</HoverTooltip>
					</td>
				{/each}
			</tr>
		{/each}
	</table>
{/if}
