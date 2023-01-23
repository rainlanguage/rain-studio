<script lang="ts">
	import { Clock } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let i: number = 0;
	export let title: string;
	export let time: number;
	export let href: string;
</script>

<a
	{href}
	class={`block-${i} rounded-xl flex flex-col justify-end p-6 gap-y-3 min-h-[200px] hover:scale-105 transition-transform cursor-pointer`}
>
	<span class="text-2xl font-semibold">{title}</span>
	<div class="flex gap-x-1">
		<span class="w-3"><Icon src={Clock} /></span>
		<span class="text-sm">{time} mins</span>
	</div>
</a>

<style lang="postcss">
	.block-0 {
		@apply bg-gradient-to-tr from-indigo-300 to-purple-400;
	}

	.block-1 {
		@apply bg-gradient-to-tr from-rose-400 to-orange-300;
	}

	.block-2 {
		@apply bg-gradient-to-tr from-teal-200 to-lime-200;
	}

	.block-3 {
		@apply bg-gradient-to-tr from-sky-400 to-cyan-300;
	}

	.block-4 {
		@apply bg-gradient-to-tr from-orange-300 to-rose-300;
	}
</style>
