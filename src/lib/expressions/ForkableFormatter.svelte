<script lang="ts">
	import { Formatter as RainlangFormatter, rainterpreterOpMeta } from '@rainprotocol/rainlang';
	import { Modal } from 'rain-svelte-components/package';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import { page } from '$app/stores';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import type { ExpressionInsert } from '$lib/types/types';
	import AuthInner from '$lib/AuthInner.svelte';

	export let raw: string | null = null;
	export let stateConfig: unknown | null = null;
	export let showFork: boolean = true;
	export let showForkLabel: boolean = false;
	export let maxHeight: string | null = null;
	export let contract: string | null = null;
	export let contractExpression: string | null = null;

	let expression: ExpressionInsert;
	let open: boolean = false;

	$: if (stateConfig)
		buildExpression(RainlangFormatter.get(stateConfig, { opmeta: rainterpreterOpMeta }));

	$: if (raw) buildExpression(raw);

	const buildExpression = (raw: string) => {
		expression = {
			name: 'Untitled',
			notes: '',
			contract,
			contract_expression: contractExpression,
			interpreter: '761f3744-fe08-4e71-b38c-faaf7b447455',
			raw_expression: raw
		};
	};

	const handleFork = () => {
		open = true;
	};
</script>

<Formatter {raw} {stateConfig} {showFork} {showForkLabel} {maxHeight} on:fork={handleFork} />

<Modal bind:open>
	{#if $page.data.session}
		<ForkExpression {expression} on:saved />
	{:else}
		<AuthInner />
	{/if}
</Modal>
