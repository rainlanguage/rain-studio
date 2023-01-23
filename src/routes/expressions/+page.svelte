<script lang="ts">
	import { page } from '$app/stores';
	import { AcademicCap, Plus, UserGroup } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import { popularTags } from './popular-tags';
	import type { PageData } from './$types';
	import { lessons } from './lessons';
	import LessonCta from '$lib/learn/LessonCTA.svelte';
	import { goto } from '$app/navigation';
	import type { ExpressionRowFull } from '$lib/types/types';
	import ExpressionTile from '$lib/expressions/ExpressionTile.svelte';

	let data: PageData, rainStarred: ExpressionRowFull[];
	$: data = $page.data as PageData;
	$: rainStarred = $page.data.rainStarred;
</script>

<div class="flex">
	<div class="flex justify-end container-pl bg-gray-100 flex-shrink-0">
		<div class="container-2/3 h-full pt-8 gap-y-20 flex flex-col flex-shrink-0 pr-8">
			<div class="flex justify-between items-end">
				<div class="flex flex-col gap-y-3">
					<span class="text-2xl font-semibold">Discover community expressions</span>
					<span class="text-lg">Get inspired by others in the community, fork and create.</span>
				</div>
				<Button
					on:click={() => {
						goto('/expression/new');
					}}
					icon={Plus}>Start a new expression</Button
				>
			</div>
			<div class="flex flex-col gap-y-6">
				<div class="flex gap-x-2">
					<span>Popular tags</span>
					{#each popularTags as tag}
						<span class="px-3 py-2 leading-none bg-gray-200 rounded-xl">#{tag}</span>
					{/each}
				</div>
				<div class="grid grid-cols-2 gap-4">
					{#each rainStarred as expression}
						<ExpressionTile {expression} />
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="flex justify-start container-pr flex-shrink-0">
		<div class="container-1/3 h-full flex-shrink-0 pl-8 pb-8 pt-8">
			<div class="flex flex-col gap-y-6">
				<span class="text-2xl font-semibold">Learn</span>
				<div class="flex gap-x-2">
					<Button
						on:click={() => {
							goto('/docs');
						}}
						size="small"
						icon={AcademicCap}>Read the docs</Button
					>
					<Button
						on:click={() => {
							goto('https://t.me/+W0aQ36ptN_E2MjZk');
						}}
						size="small"
						icon={UserGroup}>Ask the communty</Button
					>
				</div>
				{#each lessons as lesson, i}
					<LessonCta {i} time={lesson.time} title={lesson.title} href={lesson.href} />
				{/each}
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
