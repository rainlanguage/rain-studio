<script lang="ts">
	import { page } from '$app/stores';
	import { connected } from 'svelte-ethers-store';
	import { connectWallet } from '$lib/connect-wallet';
	import ConnectedTable from '$lib/connected-table/ConnectedTable.svelte';

	export let mobileContext: boolean = false;
</script>

<a
	href="/settings/profile"
	class={mobileContext ? 'mobile-profile-link text-gray-500' : 'profile-link'}>Profile</a
>
<a
	href={`/user/${$page.data.profile?.username}/expressions`}
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
	class={`${mobileContext ? 'mobile-profile-link ' : 'profile-link'}`}
	on:click|preventDefault={() => {
		// @ts-ignore
		window.location = '/sign-out';

		// goto() function does not work. The cookies are deleted, but the session still there in $page.data
		// goto('/sign-out');
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
