<script lang="ts">
	import { page } from '$app/stores';
	import type { SvelteComponentTyped } from 'svelte/internal';

	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;
	$: component = $page.data.component as unknown as C;
</script>

<h1 class="text-3xl">{$page.data.frontmatter.title}</h1>
<svelte:component this={component} />
