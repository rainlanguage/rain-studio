<script lang="ts">
	import { Button, Select } from 'rain-svelte-components/package';
	import AutoAbiFormSeparated from 'rain-svelte-components/package/auto-abi-form/AutoAbiFormSeparated.svelte';
	import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';

	export let metadata: ContractMetadata, abi: any;

	$: writeMethods = abi.abi
		.filter(
			(def: any) =>
				def.type == 'function' &&
				def.inputs.length &&
				def.name !== 'createChild' &&
				def.stateMutability !== 'view'
		)
		.map((def: any) => ({ label: def.name, value: def.name }));

	let methodName: string | number;
	let result: any;
</script>

<!-- <div class="w-full overflow-hidden">
	<pre>{JSON.stringify(abi, null, 2)}</pre>
</div> -->

<div class="flex flex-col gap-y-3">
	<span>Select a method to write:</span>
	<Select items={writeMethods} bind:value={methodName} />
</div>
{#if typeof methodName == 'string'}
	<AutoAbiFormSeparated abi={abi.abi} {metadata} {methodName} bind:result />
	<div class="self-start">
		<Button variant="primary">Deploy {metadata.name}</Button>
	</div>
{/if}
