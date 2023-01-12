<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Application } from '@splinetool/runtime';
	import { onMount } from 'svelte';

	// const canvas = document.getElementById('canvas3d');
	let canvas: HTMLCanvasElement;
	export let ready: boolean = false;

	onMount(() => {
		const app = new Application(canvas);
		app.load('https://prod.spline.design/Aj3JhedsdSefUfg2/scene.splinecode').then(() => {
			ready = true;
		});
	});
</script>

<canvas
	class={`h-full w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
	bind:this={canvas}
/>
