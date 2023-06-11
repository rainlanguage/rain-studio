<script>
	import { goto } from '$app/navigation';
</script>

<a
	href="/contracts"
	class="nav-link"
	on:click|preventDefault={() => {
		goto('/contracts');
	}}>Contracts</a
>
<a
	href="/interpreters"
	class="nav-link"
	on:click|preventDefault={() => {
		goto('/interpreters');
	}}>Interpreters</a
>
<!-- TODO: Fix -->
<!-- <a
	href="/expressions"
	class="nav-link"
	on:click|preventDefault={() => {
		goto('/expressions');
	}}>Expressions</a
> -->
<a
	href="/docs"
	class="nav-link"
	on:click|preventDefault={() => {
		goto('/docs');
	}}>Docs</a
>

<style lang="postcss">
	.nav-link {
		@apply text-gray-500;
	}
</style>
