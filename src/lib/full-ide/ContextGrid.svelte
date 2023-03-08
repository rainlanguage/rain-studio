<script lang="ts">
	import type { Expression } from 'rain-metadata/type-definitions/contract';
	import { HoverTooltip } from 'rain-svelte-components/package';

	export let contextColumns: Expression['contextColumns'];

	let maxRows = contextColumns?.length
		? Math.max(...contextColumns.map((column) => (column?.cells ? column.cells?.length : 0)))
		: 0;

	const fillContext = () => {
		return Array(contextColumns?.length)
			.fill(0)
			.map((arr) => Array(maxRows));
	};

	export let mockContext = fillContext();

	$: if ((mockContext = [])) mockContext = fillContext();

	let columns = contextColumns?.length || 0;
</script>

{#if contextColumns}
	<table class={`border border-gray-300 text-sm`}>
		<tr class="border-b border-gray-300">
			{#each Array(columns) as col, y}
				<td class="cell bg-gray-100 p-1 text-xs font-medium">{contextColumns[y].name}</td>
			{/each}
		</tr>
		{#each Array(maxRows) as row, y}
			<tr class="border-b border-gray-300">
				{#each Array(columns) as col, x}
					<td class="border-r border-gray-300 p-2">
						<HoverTooltip width="w-48" class="flex flex-col bg-white">
							<div class="flex flex-col">
								<span class="font-mono text-xs text-gray-400">{`<${x} ${y}>`}</span>
								{#if contextColumns?.[x]?.cells?.[y].alias}
									<span class="whitespace-nowrap font-mono"
										>{contextColumns[x]?.cells?.[y].alias}</span
									>
								{/if}
							</div>

							<span slot="tip"
								>{contextColumns?.[x]?.cells?.[y].description ||
									contextColumns?.[x]?.cells?.[y].name ||
									'Empty'}</span
							>
						</HoverTooltip>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="mt-0.5 flex flex-col">
							{#if contextColumns?.[x]?.cells?.[y].alias}
								<input
									class="bg-gray-100 p-1 text-gray-700"
									placeholder="..."
									bind:value={mockContext[x][y]}
								/>
							{:else}
								<span class="text-gray-300">empty</span>
							{/if}
						</div>
					</td>
				{/each}
			</tr>
		{/each}
	</table>
{/if}
