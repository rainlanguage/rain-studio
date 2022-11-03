<script lang="ts">
	import logo from './assets/rain-logo.svg';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<div class="flex justify-between px-2 py-3 sticky top-0 bg-white">
	<div class="flex items-center gap-x-2">
		<img alt="Brainscan lgoo" class="w-7" src={logo} />
		<span>Brainscan</span>
	</div>
	<div class="flex gap-x-5 items-center">
		<span>Contracts</span>
		<span>Expressions</span>
		<span>Docs</span>
		<span>Dashboard</span>
		{#if !$page.data.session}
			<button
				on:click={() => {
					goto('/login');
				}}
				class="p-1 px-2 bg-gray-700 rounded-lg text-white">Sign in</button
			>
		{:else}
			<span
				on:click={() => {
					goto('/profile');
				}}>Profile</span
			>
		{/if}
	</div>
</div>
