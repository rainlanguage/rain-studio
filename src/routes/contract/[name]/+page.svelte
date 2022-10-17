<script lang="ts">
	import { signer } from 'svelte-ethers-store';
	import type { PageData } from './$types';
	import Vapour721AFactory from '$lib/abis/Vapour721AFactory.json';
	import { Input, Parser } from 'rain-svelte-components/package';
	export let data: PageData;

	$: console.log(
		Vapour721AFactory.abi.find(
			(method) => method.name == 'createChildTyped' && method.type == 'function'
		)
	);

	$: method = Vapour721AFactory.abi.find(
		(method) => method.name == 'createChildTyped' && method.type == 'function'
	);

	$: console.log(method.inputs);

	let args: any;
</script>

<div class="p-8 mx-auto max-w-screen-xl flex flex-col w-full gap-y-8">
	{#each method.inputs as input}
		<span>{input.name}</span>
		{#each input.components as component}
			{@const type = component.internalType}
			{#if type == 'string'}
				<Input type="text">
					<span slot="label">{component.name}</span>
				</Input>
			{:else if type == 'uint256'}
				<Input type="number">
					<span slot="label">{component.name}</span>
				</Input>
			{:else if type == 'address'}
				<Input type="text">
					<span slot="label">{component.name}</span>
				</Input>
			{:else if type == 'struct StateConfig'}
				<span>Expression</span>
				<Parser signer={$signer} />
			{/if}
		{/each}
	{/each}
</div>
