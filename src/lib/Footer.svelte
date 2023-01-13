<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<div class="bg-rainsecondary">
	<div class="container mx-auto pt-14 pb-20 flex gap-x-8">
		<div class="w-48">
			<Logo />
		</div>
		<div class="flex flex-col w-48">
			<span class="font-semibold mb-2">Explore</span>
			<a href="/contracts">Contracts</a>
			<a href="/expressions">Expressions</a>
		</div>
		<div class="flex flex-col w-48">
			<span class="font-semibold mb-2">Documentation</span>
			<a href="/docs">Learn Rainlang</a>
			<a href="http://docs.rainprotocol.xyz" target="_blank" rel="noreferrer">Rain Docs</a>
			<a href="https://github.com/rain-protocol" target="_blank" rel="noreferrer">Github</a>
		</div>
		<div class="flex flex-col w-48">
			<span class="font-semibold mb-2">Community</span>
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
