<script lang="ts">
	import { page } from '$app/stores';
	import IDE from '$lib/full-ide/IDE.svelte';
	import type { ExpressionRowFull } from '$lib/types/types';

	const expression: ExpressionRowFull = $page.data.expression;
</script>

<div class="flex-grow flex flex-col">
	<IDE expression={$page.data.expression} />
</div>
