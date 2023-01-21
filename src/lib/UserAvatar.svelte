<script lang="ts">
	export let url: string | null;
	export let size = 0;
</script>

{#if url}
	<img
		alt="profile avatar"
		style={size ? `width: ${size}px; height: ${size}px;` : ''}
		class={`${size ? '' : 'w-7'} rounded-full`}
		src={url}
	/>
{:else}
	<div
		style={size ? `width: ${size}px; height: ${size}px;` : ''}
		class={`${size ? '' : 'w-7 h-7'} rounded-full bg-gradient-to-br from-pink-400 to-violet-500`}
	/>
{/if}
