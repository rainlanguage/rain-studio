<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="relative flex flex-col-reverse md:flex-row">
	<div
		class="sticky top-16 w-full overflow-y-auto border-none bg-gray-100 py-8 px-4 sm:px-0 md:h-screen md:w-80 md:border-r md:px-4 md:py-8"
	>
		<ul class="container mx-auto flex flex-col gap-y-8">
			{#each data.categorisedArticles as { category, articles }}
				<li class="flex flex-col gap-y-2">
					<span class="text-xs uppercase">{category}</span>
					{#each articles as { slug, title }}
						<a href={`/docs/${slug}`}>{title}</a>
					{/each}
				</li>
			{/each}
		</ul>
	</div>
	<div class="container mx-auto md:mx-0">
		<div class="prose px-4 py-8 sm:px-0 md:px-8">
			<slot />
		</div>
	</div>
</div>
