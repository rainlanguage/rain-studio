<script lang="ts">
	export let tags: string[] | null;
	export let limit: number | null = null;
	let moreLength = 0;
	$: if (limit && tags) {
		const oldLength = tags.length;
		tags = tags.slice(0, limit);
		moreLength = oldLength - tags.length;
	}
</script>

{#if tags}
	<div class="flex flex-wrap items-end gap-2">
		{#each tags as tag}
			<span class="rounded-md bg-gray-100 px-2 py-1 leading-none">
				#{tag}
			</span>
		{/each}
		{#if moreLength}
			<span class="text-sm">
				...{moreLength} more
			</span>
		{/if}
	</div>
{:else}
	<span>No tags</span>
{/if}
