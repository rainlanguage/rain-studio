<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { IconSource } from '@steeze-ui/heroicons/types';

	export let icon: IconSource | undefined = undefined;
	export let iconSize = '12';
	export let iconTheme = '';
	export let classes: string = '';
	export let isActived = false;
	export let colorActive = 'green';
</script>

<button
	on:click
	class={`flex flex-row items-center justify-center gap-0.5 ${classes} ${
		isActived ? colorActive : ''
	}`}
>
	{#if icon}
		<Icon src={icon} theme={iconTheme} size={iconSize} />
	{/if}
	<slot />
</button>

<style lang="postcss">
	.green {
		@apply text-green-500;
	}

	.red {
		@apply text-red-500;
	}

	.blue {
		@apply text-blue-500;
	}

	.yellow {
		@apply text-yellow-500;
	}
</style>
