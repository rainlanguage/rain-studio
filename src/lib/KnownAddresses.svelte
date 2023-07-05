<script lang="ts">
	import type { Database } from '$lib/types/generated-db-types';

	export let contract_addresses: { chain_id: number }[];

	$: addressCount = contract_addresses.length;
	$: chainCount = contract_addresses.reduce(
		(pre: Set<number>, curr: any) => pre.add(curr.chain_id),
		new Set()
	).size;
</script>

{addressCount} known address{#if addressCount > 1}es{/if} on {chainCount} chain{#if chainCount > 1}s{/if}
