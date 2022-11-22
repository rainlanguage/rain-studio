<script lang="ts">
	export let url: string;
</script>

{#if url}
	<div class="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-violet-500" />
{:else}
	<img alt="profile avatar" class="w-7 rounded-full" src={url} />
{/if}
