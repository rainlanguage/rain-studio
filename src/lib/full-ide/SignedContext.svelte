<script lang="ts">
	export let signedContext: any;

	let columns = signedContext.length;
	let rows = signedContext[0].length;

	const addRow = () => {
		signedContext = [...signedContext.map((col) => [...col, ''])];
		rows++;
	};

	const addCol = () => {
		signedContext = [...signedContext, Array(rows).fill('')];
		columns++;
	};

	const removeCol = (col: number) => {
		if (columns == 1) return;
		signedContext.splice(col, 1);
		signedContext = signedContext;
		columns--;
	};

	const removeRow = (row: number) => {
		if (rows == 1) return;
		signedContext.forEach((col) => col.splice(row, 1));
		signedContext = signedContext;
		rows--;
	};
</script>

<div class="uppercase text-xs text-gray-500 pt-4 pb-2">Signed context</div>
<table class="mb-8">
	<tr class="border-b border-gray-300">
		<td class="cell" />
		{#each Array(columns) as col, i}
			<td class="header text-center border-t border-gray-300">{i}</td>
		{/each}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<td class="text-center  border-t border-gray-300 border-r button" on:click={addCol}>+</td>
	</tr>
	{#each Array(rows) as row, x}
		<tr class="border-gray-300 border-b">
			<td class="header border-t border-gray-300 border-l">{x}</td>
			{#each signedContext as col, y}
				<td class="cell">
					<div class="flex flex-col">
						<span class="font-mono text-gray-400 text-xs">{`<${y} ${x}>`}</span>
						<input
							class="text-gray-700 bg-gray-100 p-1 text-xs"
							placeholder="..."
							bind:value={signedContext[y][x]}
						/>
					</div>
				</td>
			{/each}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<td
				class="p-2  border-gray-300 border-r button"
				on:click={() => {
					removeRow(x);
				}}>-</td
			>
		</tr>
	{/each}
	<tr>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<td class="text-center border-gray-300 border-l border-b border-r button" on:click={addRow}
			>+</td
		>
		{#each Array(columns) as col, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<td
				class="text-center border-b border-r border-gray-300 button"
				on:click={() => {
					removeCol(i);
				}}>-</td
			>
		{/each}
	</tr>
</table>

<style lang="postcss">
	.header {
		@apply text-xs text-gray-800 text-center border-r bg-gray-100 font-semibold border-gray-300;
	}

	.cell {
		@apply p-2 border-r border-gray-300;
	}

	.button {
		@apply cursor-pointer hover:bg-gray-100 bg-gray-50;
	}
</style>
