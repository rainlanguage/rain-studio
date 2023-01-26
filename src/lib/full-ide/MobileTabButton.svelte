<script lang="ts">
	import type { ShowPane } from '$lib/full-ide/types';
	import type { IconSource } from '@steeze-ui/heroicons/types';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let icon: IconSource;
	export let pane: ShowPane;
	export let mobileActivePane: ShowPane;

	$: active = pane == mobileActivePane;

	const handleClick = () => {
		mobileActivePane = pane;
	};
</script>

<button
	on:click={handleClick}
	class={`w-8 rounded-lg p-2 transition-all ${active ? 'active' : 'inactive'}`}
>
	<Icon src={icon} />
</button>

<style lang="postcss">
	.active {
		@apply bg-gray-700 text-white;
	}

	.inactive {
		@apply bg-gray-100 text-gray-900;
	}
</style>
