<script lang="ts">
	import { fly } from 'svelte/transition';
	import logo from './assets/rain-logo.svg';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabaseClient } from '$lib/supabaseClient';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { Input } from 'rain-svelte-components/package';
	import { onMount } from 'svelte';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';
	import { connected } from 'svelte-ethers-store';
	import { connectWallet } from '$lib/connect-wallet';

	let profileMenuOpen: boolean = false;
	let addressOrText = '';

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

	async function signOut() {
		try {
			let { error } = await supabaseClient.auth.signOut();
			if (error) throw error;
			goto('/');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
		}
	}
</script>

<div
	class="flex justify-between px-4 py-3 sticky top-0 bg-white bg-opacity-70 backdrop-blur-md border-b border-gray-200 z-20"
>
	<div class="flex items-center gap-x-2.5 w-max">
		<a href="/" class="flex flex-row w-max">
			<img alt="Rain Studio logo" class="w-7" src={logo} />
			<span class="font-medium mr-2 ml-2.5">Rain Studio</span>
		</a>
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
				class="text-black nav-link">Sign in</a
			>
			<a
				href="/sign-up"
				on:click={() => {
					goto('/sign-up');
				}}
				class="p-1 px-2 -ml-2 border border-black rounded-lg text-black">Sign Up</a
			>
		{:else}
			<!-- <a
				href="/dashboard"
				class="nav-link"
				on:click|preventDefault={() => {
					goto('/dashboard');
				}}>Dashboard</a
			> -->
			<div class="relative flex flex-col items-center" on:focusout={handleDropdownFocusLoss}>
				<button on:click={openProfileMenu}>
					<UserAvatar url={$page.data.profile.avatar_url} />
				</button>
				{#if profileMenuOpen}
					<div
						transition:fly={{ duration: 300, y: 10 }}
						class="absolute right-0 -bottom-4 bg-white flex flex-col gap-y-2 translate-y-full w-56 rounded-xl py-3 border border-gray-100 shadow-md"
					>
						<a href="/settings/profile" class="profile-link">Profile</a>
						<div class="border-t border-gray-200" />
						<a href={`/user/${$page.data.profile.username}/expressions`} class="profile-link"
							>Expressions</a
						>
						<!-- <a class="profile-link">Deployments</a> -->
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

						<div on:click={signOut} class="profile-link">Sign out</div>
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
		@apply px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-lg mx-2;
	}
</style>
