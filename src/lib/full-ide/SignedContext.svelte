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

<table class="mb-8">
	<tr class="border-b border-gray-300">
		<td class="cell" />
		{#each Array(columns) as col, i}
			<td class="header border-t border-gray-300 text-center">{i}</td>
		{/each}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<td class="button  border-t border-r border-gray-300 text-center" on:click={addCol}>+</td>
	</tr>
	{#each Array(rows) as row, x}
		<tr class="border-b border-gray-300">
			<td class="header border-t border-l border-gray-300">{x}</td>
			{#each signedContext as col, y}
				<td class="cell">
					<div class="flex flex-col">
						<span class="font-mono text-xs text-gray-400">{`<${y} ${x}>`}</span>
						<input
							class="bg-gray-100 p-1 text-xs text-gray-700"
							placeholder="..."
							bind:value={signedContext[y][x]}
						/>
					</div>
				</td>
			{/each}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<td
				class="button  border-r border-gray-300 p-2"
				on:click={() => {
					removeRow(x);
				}}>-</td
			>
		</tr>
	{/each}
	<tr>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<td class="button border-l border-b border-r border-gray-300 text-center" on:click={addRow}
			>+</td
		>
		{#each Array(columns) as col, i}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<td
				class="button border-b border-r border-gray-300 text-center"
				on:click={() => {
					removeCol(i);
				}}>-</td
			>
		{/each}
	</tr>
</table>

<style lang="postcss">
	.header {
		@apply border-r border-gray-300 bg-gray-100 text-center text-xs font-semibold text-gray-800;
	}

	.cell {
		@apply border-r border-gray-300 p-2;
	}

	.button {
		@apply cursor-pointer bg-gray-50 hover:bg-gray-100;
	}
</style>
