<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isOrgContext, userContextData } from '$lib/stores';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { ChevronUpDown, PlusCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { fly } from 'svelte/transition';
	import { handleSetContext } from '$lib/user-context';
	import { connectWallet } from '$lib/connect-wallet';
	import { connected } from 'svelte-ethers-store';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';

	export let isOpen: boolean;

	const openDropdown = () => {
		isOpen = !isOpen;
	};
</script>

<div class="relative flex flex-col items-center">
	<button on:click={openDropdown}>
		<!-- TODO: Add store with the current context info (username/org name, etc) -->
		<UserAvatar isOrg={$isOrgContext} url={$page.data.profile?.avatar_url} />
	</button>
	{#if isOpen}
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
				<button on:click={connectWallet} class="profile-link text-left">Connect Wallet</button>
			{:else}
				<div class="px-5 py-3 w-full">
					<ConnectedTable size="small" />
				</div>
			{/if}
			<div class="border-t border-gray-200" />
			<a
				href="/sign-out"
				class="profile-link"
				on:click={() => {
					// The user sign out his account so we invalidate all and re-run the load functions.
					goto('/sign-out', { invalidateAll: true });
				}}
				>Sign out
			</a>
		</div>
	{/if}
</div>

<style lang="postcss">
	.profile-link {
		@apply px-4 py-2 mx-2 cursor-pointer hover:bg-gray-200 rounded-lg;
	}
</style>
