<script lang="ts">
	import { page } from '$app/stores';
	import { connected } from 'svelte-ethers-store';
	import { connectWallet } from '$lib/connect-wallet';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';
	import { goto } from '$app/navigation';
	import { ContextRoles } from '$lib/user-context';

	export let mobileContext = false;
</script>

<a
	href="/settings/profile"
	class={mobileContext ? 'mobile-profile-link text-gray-500' : 'profile-link'}>Profile</a
>
<a
	href={$page.data.userContext?.__ContextType == ContextRoles.USER
		? `/user/${$page.data.profile?.username}/expressions`
		: `/organization/${$page.data.userContext?.name}/expressions`}
	class={mobileContext ? 'mobile-profile-link text-gray-500' : 'profile-link'}>Expressions</a
>
<!-- <a class="profile-link">Deployments</a> -->
<div class="border-t border-gray-200" />
{#if !$connected}
	<button
		on:click={connectWallet}
		class={`${mobileContext ? 'mobile-profile-link' : 'profile-link'} text-left`}
		>Connect Wallet</button
	>
{:else}
	<div class={`w-full ${mobileContext ? 'py-3' : 'px-5 py-2'}`}>
		<ConnectedTable size="small" />
	</div>
{/if}
<div class="border-t border-gray-200" />
<a
	href="/sign-out"
	class={mobileContext ? 'mobile-profile-link text-gray-500' : 'profile-link'}
	on:click={() => {
		// The user sign out his account so we invalidate all and re-run the load functions.
		goto('/sign-out', { invalidateAll: true });
	}}
	>Sign out
</a>

<style lang="postcss">
	.profile-link {
		@apply mx-2 cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-100;
	}

	.mobile-profile-link {
		@apply cursor-pointer hover:bg-gray-100;
	}
</style>
