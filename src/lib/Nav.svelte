<script lang="ts">
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabaseClient } from '$lib/supabaseClient';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { Input } from 'rain-svelte-components/package';
	import { onMount } from 'svelte';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';
	import { connected } from 'svelte-ethers-store';
	import { connectWallet } from '$lib/connect-wallet';
	import Logo from '$lib/Logo.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { PlusCircle, ChevronUpDown } from '@steeze-ui/heroicons';
	import { isOrgContext } from '$lib/stores';
	let profileMenuOpen: boolean = false;
	let contextMenuOpen: boolean = false;
	let addressOrText = '';

	onMount(() => (addressOrText = ''));

	const searchAddressOrText = async (event) => {
		event?.target?.reset();
		goto(`/search/${addressOrText.toLowerCase()}`);
	};

	const openProfileMenu = () => {
		profileMenuOpen = !profileMenuOpen;
	};

	const openContextMenu = () => {
		contextMenuOpen = !contextMenuOpen;
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
			<div class="relative flex flex-col items-center" on:focusout={handleDropdownFocusLoss}>
				<button class="flex items-center" on:click={openContextMenu}>
					<div>Username</div>
					<div class="pt-0.5">
						<Icon src={ChevronUpDown} size={'20'} />
					</div>
				</button>
				{#if contextMenuOpen}
					<div
						transition:fly={{ duration: 300, y: 10 }}
						class="absolute right-0 -bottom-4 bg-white flex flex-col gap-y-2 translate-y-full w-56 rounded-xl py-3 border border-gray-100 shadow-md"
					>
						<!-- User logged -->
						<div class="context-option">
							<UserAvatar url={$page.data.profile?.avatar_url} />
							{$page.data.profile.username}
						</div>
						{#if $page.data.orgs && $page.data.orgs.length}
							{#each $page.data.orgs as organization}
								<!-- if have organizations -->
								<div class="context-option">
									<UserAvatar isOrg url={organization.url} />
									{organization.username}
								</div>
							{/each}
						{/if}
						<!-- Allow create -->
						<div class="flex border-t-[1px] border-gray-200">
							<button class="add-org-option" on:click={() => console.log('creating new org...')}>
								<Icon src={PlusCircle} size={'30'} />
								Create organization
							</button>
						</div>
					</div>
				{/if}
			</div>
			<div class="relative flex flex-col items-center" on:focusout={handleDropdownFocusLoss}>
				<button on:click={openProfileMenu}>
					<!-- TODO: Add store with the current context info (username/org name, etc) -->
					<UserAvatar isOrg={$isOrgContext} url={$page.data.profile?.avatar_url} />
				</button>
				{#if profileMenuOpen}
					<div
						transition:fly={{ duration: 300, y: 10 }}
						class="absolute right-0 -bottom-4 bg-white flex flex-col gap-y-2 translate-y-full w-56 rounded-xl py-3 border border-gray-100 shadow-md"
					>
						<a href="/settings/profile" class="profile-link">Profile</a>
						<div class="border-t border-gray-200" />
						<a href={`/user/${$page.data.profile?.username}/expressions`} class="profile-link"
							>Expressions</a
						>
						<!-- <a class="profile-link">Deployments</a> -->
						{#if $isOrgContext}
							<a href={`/organization`} class="profile-link">Organization</a>
						{/if}
						<div class="border-t border-gray-200" />
						{#if !$connected}
							<!-- <div class="self-start p-4">
								<ConnectWallet variant="black" />
							</div> -->
							<button on:click={connectWallet} class="profile-link text-left">Connect Wallet</button
							>
						{:else}
							<div class="px-5 py-3 w-full">
								<ConnectedTable size="small" />
							</div>
						{/if}
						<div class="border-t border-gray-200" />
						<a
							href="/sign-out"
							class="profile-link"
							on:click|preventDefault={() => {
								// @ts-ignore
								window.location = '/sign-out';

								// goto() function does not work. The cookies are deleted, but the session still there in $page.data
								// goto('/sign-out');
							}}
							>Sign out
						</a>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.nav-link {
		@apply text-gray-500;
	}
	.profile-link {
		@apply px-4 py-2 mx-2 cursor-pointer hover:bg-gray-500 rounded-lg;
	}

	.option {
		@apply flex items-center gap-x-2.5 place-content-start w-full py-1 mx-1 cursor-pointer hover:bg-gray-500 rounded-lg;
	}

	.context-option {
		@apply option px-1.5;
	}
	.add-org-option {
		@apply option px-1 mt-2;
	}
</style>
