<script lang="ts">
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { afterNavigate, goto, preloadCode, preloadData } from '$app/navigation';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { Input } from 'rain-svelte-components/package';
	import { onMount } from 'svelte';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';
	import { connected } from 'svelte-ethers-store';
	import { connectWallet } from '$lib/connect-wallet';
	import Logo from '$lib/Logo.svelte';
	import { isOrgContext, userContextData } from '$lib/stores';
	import { handleSetContext } from '$lib/user-context';
	import ContextDropdown from '$lib/user-context/ContextDropdown.svelte';
	import ProfileDropdown from '$lib/ProfileDropdown.svelte';

	let profileMenuOpen: boolean = false;
	let contextMenuOpen: boolean = false;
	let addressOrText = '';

	// TODO: Improve to handle using $paga.data or cookie
	handleSetContext($page.data.profile, 'user');

	onMount(() => {
		addressOrText = '';
	});

	afterNavigate(() => {});

	const searchAddressOrText = async (event) => {
		event?.target?.reset();
		goto(`/search/${addressOrText.toLowerCase()}`);
	};

	const openProfileMenu = () => {
		profileMenuOpen = !profileMenuOpen;
	};

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		// Use "focusout" event to ensure that we can close the dropdown when clicking
		// outside or when we leave the dropdown with the "Tab" button.
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return;

		// Check if the new focus target doesn't present in the dropdown tree (exclude
		//  ul\li padding area because relatedTarget, in this case, will be null)
		profileMenuOpen = false;
		contextMenuOpen = false;
	};
</script>

<div
	class="flex justify-between px-4 py-3 sticky top-0 bg-white bg-opacity-70 backdrop-blur-md border-b border-gray-200 z-20"
>
	<div class="flex items-center gap-x-2.5 w-max">
		<Logo />
		<div class="w-[345px]">
			<form on:submit|preventDefault={searchAddressOrText}>
				<Input placeholder="Search rain" bind:value={addressOrText} />
				<button hidden />
			</form>
		</div>
		<div class="flex gap-x-4 items-center">
			<a
				href="/contracts"
				class="nav-link"
				on:click|preventDefault={() => {
					goto('/contracts');
				}}>Contracts</a
			>
			<a
				href="/expressions"
				class="nav-link"
				on:click|preventDefault={() => {
					goto('/expressions');
				}}>Expressions</a
			>
			<a
				href="/docs"
				class="nav-link"
				on:click|preventDefault={() => {
					goto('/docs');
				}}>Docs</a
			>
			<!-- <span class="nav-link">Docs</span> -->
		</div>
	</div>
	<div class="flex gap-x-5 items-center">
		{#if !$page.data.session}
			<a
				href="/sign-in"
				on:click={() => {
					goto('/sign-in');
				}}
				class="p-1 px-2 -ml-2 border border-black rounded-lg text-black">Sign In</a
			>
		{:else}
			<!-- <a
				href="/dashboard"
				class="nav-link"
				on:click|preventDefault={() => {
					goto('/dashboard');
				}}>Dashboard</a
			> -->
			<span class="text-red-400">[Alpha version]</span>
			<div on:focusout={handleDropdownFocusLoss}>
				<ContextDropdown bind:isOpen={contextMenuOpen} />
			</div>
			<div on:focusout={handleDropdownFocusLoss}>
				<ProfileDropdown bind:isOpen={profileMenuOpen} />
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.nav-link {
		@apply text-gray-500;
	}
</style>
