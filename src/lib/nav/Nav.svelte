<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { Input } from '@rainprotocol/rain-svelte-components';
	import { onMount } from 'svelte';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';
	import { connectWallet } from '$lib/connect-wallet';
	import Logo from '$lib/Logo.svelte';
	import { breakpoint, Breakpoints } from '$lib/breakpoint-stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Bars3, XMark } from '@steeze-ui/heroicons';
	import MainNavLinks from '$lib/nav/MainNavLinks.svelte';
	import ProfileLinks from '$lib/nav/ProfileLinks.svelte';

	let profileMenuOpen: boolean = false;
	let addressOrText = '';
	let mobileNavOpen: boolean = false;

	onMount(() => (addressOrText = ''));

	const searchAddressOrText = async (event) => {
		event?.target?.reset();
		goto(`/search/${addressOrText.toLowerCase()}`);
	};

	const openProfileMenu = () => {
		profileMenuOpen = !profileMenuOpen;
	};

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		// use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		// check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return;
		profileMenuOpen = false;
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
	<div class="flex items-center gap-x-5">
		<span class="text-red-400">[Alpha version]</span>
		<button on:click={toggleMobileNav} class="w-8 md:hidden">
			<Icon src={mobileNavOpen ? XMark : Bars3} />
		</button>
		<!-- TODO: Fix -->
		<!-- {#if !$page.data.session}
			<a
				href="/sign-in"
				on:click={() => {
					goto('/sign-in');
				}}
				class="-ml-2 hidden rounded-lg border border-black p-1 px-2 text-black md:block">Sign In</a
			>
		{:else}
			<div
				class="relative hidden flex-col items-center md:flex"
				on:focusout={handleDropdownFocusLoss}
			>
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
		{/if} -->
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
			<!-- TODO: Fix -->
			<!-- {#if !$page.data.session}
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
			{/if} -->
		</div>
		<form on:submit|preventDefault={searchAddressOrText}>
			<Input placeholder="Search Rain" bind:value={addressOrText} />
			<button hidden />
		</form>
	</div>
{/if}
