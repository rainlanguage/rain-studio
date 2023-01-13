<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex relative">
	<div
		class="flex flex-col w-80 border-r border-gray-300 overflow-y-auto p-8 gap-y-6 h-screen sticky top-16"
	>
		{#each data.categorisedArticles as { category, articles }}
			<div class="flex flex-col gap-y-2">
				<span class="uppercase text-xs">{category}</span>
				{#each articles as { slug, title }}
					<a href={`/docs/${slug}`}>{title}</a>
				{/each}
			</div>
		{/each}
	</div>
	<div class="">
		<div class="prose p-8 ">
			<slot />
		</div>
	</div>
</div>
