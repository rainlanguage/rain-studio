<script lang="ts">
	import { fade } from 'svelte/transition';
	import IDE from '$lib/full-ide/IDE.svelte';
	import type { ExpressionRowFull } from '$lib/types/types';
	import { onMount } from 'svelte/internal';

	export let open: boolean;
	export let expression: ExpressionRowFull;
	export let loadRaw: Function;
	let modalWrapper: HTMLDivElement;

	onMount(() => {
		document.body.appendChild(modalWrapper);
	});

	$: document.body.classList.toggle('overflow-y-hidden', open);

	const closeCallback = (raw: string) => {
		loadRaw(raw);
		open = false;
	};
</script>

<div
	bind:this={modalWrapper}
	class="fixed inset-0 w-full h-full bg-white z-50 flex flex-col"
	class:hidden={!open}
>
	{#if open}
		<div class="flex flex-col flex-grow" transition:fade>
			<IDE {expression} asModal {closeCallback} />
		</div>
	{/if}
</div>
