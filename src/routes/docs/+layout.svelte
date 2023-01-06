<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-grow min-h-0">
	<div
		class="flex flex-col w-72 self-stretch shrink-0 border-r border-gray-300 overflow-y-auto p-8 gap-y-6"
	>
		{#each data.categorisedArticles as { category, articles }}
			<div class="flex flex-col gap-y-2">
				<span class="uppercase text-xs">{category}</span>
				{#each articles as { slug, title }}
					<a href={`/docs/guides/${slug}`}>{title}</a>
				{/each}
			</div>
		{/each}
	</div>
	<div class="self-stretch overflow-y-auto justify-self-stretch flex-grow">
		<div class="prose p-8 ">
			<slot />
		</div>
	</div>
</div>
