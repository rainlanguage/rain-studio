<script>
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
</script>

<PageHeader>
	<div class="w-full flex justify-between items-center container mx-auto">
		<span class="text-2xl font-semibold">Account</span>
	</div>
</PageHeader>
<div class="w-full flex-grow bg-white">
	<div class="container mx-auto flex mt-8">
		<div class="w-1/3 text-xl font-semibold flex flex-col gap-y-4 text-gray-400">
			<a
				class="navlink"
				href="/settings/profile"
				class:active={$page.url.pathname === '/settings/profile'}>Profile</a
			>
			<a
				class="navlink"
				href="/settings/wallets"
				class:active={$page.url.pathname === '/settings/wallets'}>Linked wallets</a
			>
		</div>
		<div class="w-2/5">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss" global>
	:local(.active) {
		@apply text-black;
	}

	:local(.navlink) {
		@apply hover:opacity-75 transition-colors transition-opacity;
	}
</style>
