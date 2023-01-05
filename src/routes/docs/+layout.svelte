<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-grow min-h-0">
	<div
		class="flex flex-col w-72 self-stretch shrink-0 border-r border-gray-300 overflow-y-auto p-8"
	>
		{#each data.posts as { slug, title, author, description, date }}
			<a href={`/docs/guides/${slug}`}>{title}</a>
		{/each}
	</div>
	<div class="self-stretch overflow-y-auto justify-self-stretch flex-grow">
		<div class="prose pl-8 pt-8 ">
			<slot />
		</div>
	</div>
</div>
