<script lang="ts">
	import type { Expression } from 'rain-metadata/metadata-types/contract';

	export let contextColumns: Expression['contextColumns'];
</script>

{#if contextColumns}
	<div
		class={`text-sm border border-gray-300 rounded-lg grid divide-x divide-y grid-flow-col`}
		style={`grid-template-rows: ${
			'min-content' + contextColumns[0].cells?.map((i) => ' min-content').join('')
		};`}
	>
		{#each contextColumns as column, x}
			<div class="p-1 text-xs font-medium">{column.name}</div>
			{#if column?.cells}
				{#each column.cells as cell, y}
					<div class="flex flex-col p-1">
						<span class="font-mono text-gray-400 text-xs">{`<${x} ${y}>`}</span>
						{#if cell.name}
							<span class="font-mono">{cell.alias}</span>
						{:else}
							<span class="text-gray-300">empty</span>
						{/if}
						<!-- <span>{cell.description || ''}</span> -->
					</div>
				{/each}
			{/if}
		{/each}
	</div>
{/if}
