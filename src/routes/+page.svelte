<script lang="ts">
	import { Button } from 'rain-svelte-components/package';
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import { goto } from '$app/navigation';
</script>

<Background>
	<div class="flex flex-col gap-y-8">
		<span class="text-2xl font-semibold">Welcome to the Rain Studio alpha</span>
		<span>Please leave feedback in the telegram channel 🙂</span>
		<a
			class="underline text-blue-600"
			rel="noreferrer"
			target="_blank"
			href="https://drive.google.com/drive/u/1/folders/1P9v5amWWPr3Pf-La9Umbfrc1OlEkqYaT"
			>Guides for the alpha testing phase</a
		>
		{#if !$page.data.session}
			<div class="flex gap-x-2 items-center">
				<Button
					on:click={() => {
						goto('/sign-in');
					}}
					variant="primary">Sign In</Button
				>
			</div>
		{:else}
			<div class="flex gap-x-2 items-center">
				<Button
					variant="primary"
					on:click={() => {
						goto(`/user/${$page.data.profile.username}/expressions`);
					}}
				>
					View your expressions
				</Button>
				<Button
					variant="primary"
					on:click={() => {
						goto('/expression/new');
					}}>Create a new expression</Button
				>
			</div>
		{/if}
	</div>
</Background>
