<script lang="ts">
	import { page } from '$app/stores';
	import IDE from '$lib/full-ide/IDE.svelte';
	import type { ExpressionRow, ContractRow, ExpressionRowFull } from '$lib/types/types';
	import { contracts } from 'svelte-ethers-store';

	const expression: ExpressionRowFull = $page.data.expression;
</script>

<div class="flex-grow flex flex-col">
	<IDE expression={$page.data.expression} />
</div>
