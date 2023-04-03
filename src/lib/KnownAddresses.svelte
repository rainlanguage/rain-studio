<script lang="ts">
	export let metadata: any;

	$: addressCount = metadata?.addresses.length;
	$: chainCount = metadata?.addresses.reduce(
		(pre: Set<number>, curr: any) => pre.add(curr.chain),
		new Set()
	).size;
</script>

{addressCount} known address{#if addressCount > 1}es{/if} on {chainCount} chain{#if chainCount > 1}s{/if}
