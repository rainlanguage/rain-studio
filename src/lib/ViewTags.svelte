<script lang="ts">
	export let tags: string[];
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag}
		<span class="bg-gray-100 rounded-md px-2 py-1 leading-none">
			{tag}
		</span>
	{/each}
</div>
