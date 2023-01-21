<script lang="ts">
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import type { ExpressionRowFull } from '$lib/types/types';
	import UserTag from '$lib/UserTag.svelte';
	import ViewTags from '$lib/ViewTags.svelte';

	export let expression: ExpressionRowFull;
</script>

<a
	href={`/expression/draft/${expression.sharable_slug}`}
	class="px-6 py-8 rounded-lg bg-white flex flex-col gap-y-4 transition-transform hover:scale-105"
>
	<span class="text-lg font-medium">{expression.name}</span>
	<span class="line-clamp-2">{expression.notes}</span>
	<ViewTags tags={expression.tags} limit={3} />
	<div class="gap-y-1 flex flex-col">
		<ExpressionEnv {expression} showProject={false} compact />
	</div>
	<UserTag user={expression.user_id} />
</a>
