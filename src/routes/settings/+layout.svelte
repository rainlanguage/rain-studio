<script>
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
</script>

<PageHeader>
	<div class="container mx-auto flex w-full items-center justify-between px-4 sm:px-0">
		<span class="text-2xl font-semibold">Account</span>
	</div>
</PageHeader>
<div class="mb-8 w-full flex-grow bg-white md:mb-0">
	<div class="container mx-auto mt-4 flex flex-col gap-y-8 px-4 sm:px-0 md:mt-8 md:flex-row">
		<div
			class="flex flex-row gap-4 border-b border-gray-300 pb-2 text-lg font-semibold text-gray-400 md:w-1/3 md:flex-col md:border-none md:pb-0 md:text-xl"
		>
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
		<div class="w-full md:w-2/3">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss" global>
	:local(.active) {
		@apply text-black;
	}

	:local(.navlink) {
		@apply transition-colors transition-opacity hover:opacity-75;
	}
</style>
