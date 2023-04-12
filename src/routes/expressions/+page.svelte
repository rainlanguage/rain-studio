<script lang="ts">
	import { page } from '$app/stores';
	import { AcademicCap, Plus, UserGroup } from '@steeze-ui/heroicons';
	import { Button } from '@rainprotocol/rain-svelte-components';
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

<div class="flex flex-col xl:flex-row">
	<div class="xl:container-pl flex flex-shrink-0 justify-end bg-gray-100">
		<div
			class="xl:container-2/3 container mx-auto flex h-full w-full flex-shrink-0 flex-col gap-y-12 px-4 py-8 pt-8 sm:px-0 md:gap-y-20 xl:mx-0 xl:pr-8"
		>
			<div
				class="flex flex-col items-start gap-y-4 md:flex-row md:items-end md:justify-between md:gap-y-0"
			>
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
				<div class="flex flex-col gap-2 sm:flex-row">
					<span>Popular tags</span>
					<div class="flex flex-wrap gap-2">
						{#each popularTags as tag}
							<span class="rounded-xl bg-gray-200 px-3 py-2 leading-none">#{tag}</span>
						{/each}
					</div>
				</div>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					{#each rainStarred as expression}
						<ExpressionTile {expression} />
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="xl:container-pr flex flex-shrink-0 justify-start bg-gray-100 xl:bg-white">
		<div
			class="xl:container-1/3 container mx-auto h-full w-full flex-shrink-0 py-2 px-4 pb-8 pt-8 sm:px-0 xl:mx-0 xl:pl-8"
		>
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
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
					{#each lessons as lesson, i}
						<LessonCta {i} time={lesson.time} title={lesson.title} href={lesson.href} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
</style>
