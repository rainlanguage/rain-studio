<script lang="ts">
	export let url: string;
	export let size = 0;
	export let isOrg = false;
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
		class={`${size ? '' : 'w-7 h-7'} ${isOrg ? 'org' : 'profile'}`}
	/>
{/if}

<style lang="postcss">
	.profile {
		@apply rounded-full bg-gradient-to-br from-pink-400 to-violet-600;
	}
	.org {
		@apply rounded-lg bg-gradient-to-b from-green-600 to-blue-500;
	}
</style>
