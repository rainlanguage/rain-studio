<script lang="ts" context="module">
	export type Item = {
		label: string;
		value: any;
	};
</script>

<script lang="ts">
	export let items: Item[] = [];
	export let value: any = null;

	/**
	 * Class definition to give styling to the container of the options/items
	 */
	export let classContainer = 'default-container';

	/**
	 * Class definition to give styling to the options/items
	 */
	export let classOptions = 'default-item';

	const selectItem = (value_: Item) => {
		value = value_;
	};
</script>

<div class="container {classContainer}">
	{#each items as item}
		<div class={classOptions} on:click={() => selectItem(item)} on:keydown={() => selectItem(item)}>
			{item.label}
		</div>
	{/each}
</div>

<style lang="postcss">
	/* Defaults */
	.default-item {
		@apply px-2 py-1;
	}
	.default-item:hover {
		@apply bg-gray-300;
	}
	.default-container {
		@apply text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md;
	}

	/* Not customizable by consumer */
	.container {
		@apply flex flex-col w-fit min-w-full overflow-y-scroll overflow-x-hidden;
	}
</style>
