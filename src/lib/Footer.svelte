<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<div class="bg-rainsecondary">
	<div class="container mx-auto flex flex-col gap-8 px-4 pt-8 pb-20 sm:px-0 md:flex-row md:pt-14">
		<div class="w-48">
			<Logo />
		</div>
		<div class="flex w-48 flex-col">
			<span class="mb-2 font-semibold">Explore</span>
			<a href="/contracts">Contracts</a>
		<!-- TODO: Fix -->
		<!-- <a href="/expressions">Expressions</a> -->
		</div>
		<div class="flex w-48 flex-col">
			<span class="mb-2 font-semibold">Documentation</span>
			<a href="/docs">Learn Rainlang</a>
			<a href="http://docs.rainprotocol.xyz" target="_blank" rel="noreferrer">Rain Docs</a>
			<a href="https://github.com/rain-protocol" target="_blank" rel="noreferrer">Github</a>
		</div>
		<div class="flex w-48 flex-col">
			<span class="mb-2 font-semibold">Community</span>
			<a href="https://t.me/+W0aQ36ptN_E2MjZk">Telegram</a>
			<a href="https://twitter.com/rainprotocol">Twitter</a>
			<a href="https://docs.rainprotocol.xyz/blog">Blog</a>
		</div>
	</div>
</div>

<style lang="postcss">
	a {
		@apply hover:opacity-80;
	}
</style>
