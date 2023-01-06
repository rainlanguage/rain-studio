<script lang="ts">
	import type { PageData } from '../$types';
	import type { SvelteComponentTyped } from 'svelte/internal';

	export let data: PageData;

	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;
	const component = data.component as unknown as C;
</script>

<svelte:component this={component} />
