<script lang="ts">
	import logo from './assets/rain-logo.svg';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<div
	class="flex justify-between px-4 py-3 sticky top-0 bg-white bg-opacity-70 backdrop-blur-md border-b border-gray-200"
>
	<div class="flex items-center gap-x-2">
		<img alt="Rain Studio lgoo" class="w-7" src={logo} />
		<span class="text-xl font-medium">Rain Studio</span>
	</div>
	<div class="flex gap-x-5 items-center">
		<a
			href="/contracts"
			on:click|preventDefault={() => {
				goto('/contracts');
			}}>Contracts</a
		>
		<span>Expressions</span>
		<span>Docs</span>
		<span>Dashboard</span>
		{#if !$page.data.session}
			<a
				href="/login"
				on:click={() => {
					goto('/login');
				}}
				class="p-1 px-2 -mr-2 bg-gray-700 rounded-lg text-white">Log in</a
			>
			<a
				href="/signup"
				on:click={() => {
					goto('/signup');
				}}
				class="p-1 px-2 -ml-2 bg-gray-700 rounded-lg text-white">Sign Up</a
			>
		{:else}
			<a
				href="/profile"
				on:click|preventDefault={() => {
					goto('/profile');
				}}>Profile</a
			>
		{/if}
	</div>
</div>
