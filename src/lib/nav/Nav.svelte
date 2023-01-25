<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { Input } from 'rain-svelte-components/package';
	import { onMount } from 'svelte';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';
	import { connected } from 'svelte-ethers-store';
	import { connectWallet } from '$lib/connect-wallet';
	import Logo from '$lib/Logo.svelte';
	import { breakpoint, Breakpoints } from '$lib/breakpoint-stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bars3, XMark } from '@steeze-ui/heroicons';
	import MainNavLinks from '$lib/nav/MainNavLinks.svelte';
	import ProfileLinks from '$lib/nav/ProfileLinks.svelte';
	import ContextDropdown from '$lib/user-context/ContextDropdown.svelte';
	import { handleSetContext } from '$lib/user-context';
	import { viewportWidth } from '$lib/breakpoint-stores';

	let profileMenuOpen: boolean = false;
	let addressOrText = '';
	let mobileNavOpen: boolean = false;
	let contextMenuOpen: boolean = false;
	$: _viewWidth = $viewportWidth;

	// TODO: Improve to handle using $paga.data or cookie
	handleSetContext($page.data.profile, 'user');

	onMount(() => (addressOrText = ''));

	const searchAddressOrText = (event: Event & { currentTarget: EventTarget & HTMLFormElement }) => {
		goto(`/search/${addressOrText.toLowerCase()}`).then(() => {
			(event?.target as HTMLFormElement).reset();
		});
	};

	const openProfileMenu = () => {
		profileMenuOpen = !profileMenuOpen;
	};

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }: FocusEvent) => {
		// use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		// check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		if (relatedTarget instanceof HTMLElement && currentTarget?.contains(relatedTarget)) return;
		profileMenuOpen = false;
		contextMenuOpen = false;
	};

	const toggleMobileNav = () => {
		mobileNavOpen = !mobileNavOpen;
	};
</script>

<div
	class="sticky top-0 z-20 flex justify-between border-b border-gray-200 bg-white bg-opacity-70 px-4 py-3 backdrop-blur-md"
>
	<div class="flex w-max items-center gap-x-2.5">
		<Logo />
		<div class="hidden md:block lg:w-[345px]">
			<form on:submit|preventDefault={searchAddressOrText}>
				<Input placeholder="Search Rain" bind:value={addressOrText} />
				<button hidden />
			</form>
		</div>
		<div class="hidden items-center gap-x-4 md:flex">
			<MainNavLinks />
		</div>
	</div>
	<div class="flex items-center gap-x-2 md:gap-x-5">
		{#if _viewWidth < 400}
			<span class="text-red-400">[Alpha]</span>
		{:else}
			<span class="text-red-400">[Alpha version]</span>
		{/if}

		{#if $page.data.session}
			<div class="static md:block" on:focusout={handleDropdownFocusLoss}>
				<ContextDropdown bind:isOpen={contextMenuOpen} />
			</div>
		{/if}

		<button on:click={toggleMobileNav} class="w-8 md:hidden">
			<Icon src={mobileNavOpen ? XMark : Bars3} />
		</button>

		{#if !$page.data.session}
			<a
				href="/sign-in"
				on:click={() => {
					goto('/sign-in');
				}}
				class="-ml-2 hidden rounded-lg border border-black p-1 px-2 text-black md:block">Sign In</a
			>
		{:else}
			<div class="hidden flex-col items-center md:flex" on:focusout={handleDropdownFocusLoss}>
				<button on:click={openProfileMenu}>
					<UserAvatar url={$page.data.profile?.avatar_url} />
				</button>
				{#if profileMenuOpen}
					<div
						transition:fly={{ duration: 300, y: 10 }}
						class="absolute right-0 -bottom-4 flex w-56 translate-y-full flex-col gap-y-2 rounded-xl border border-gray-100 bg-white py-3 shadow-md"
					>
						<ProfileLinks />
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

{#if mobileNavOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		transition:fade
		class="fixed inset-4 top-16 z-50 flex flex-col justify-between rounded-lg bg-white p-8 shadow-lg"
		on:click={toggleMobileNav}
	>
		<div class="flex flex-col gap-y-8">
			<div class="flex flex-col gap-y-4">
				<span class="font-semibold">Explore Rain</span>
				<MainNavLinks />
			</div>
			{#if !$page.data.session}
				<a
					href="/sign-in"
					on:click={() => {
						goto('/sign-in');
					}}
					class="rounded-lg border border-black p-1 px-2 text-center text-black">Sign In</a
				>
			{:else}
				<div class="flex flex-col gap-y-4">
					<span class="font-semibold">Profile</span>
					<ProfileLinks mobileContext />
				</div>
			{/if}
		</div>
		<form on:submit|preventDefault={searchAddressOrText}>
			<Input placeholder="Search Rain" bind:value={addressOrText} />
			<button hidden />
		</form>
	</div>
{/if}
