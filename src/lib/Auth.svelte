<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { Button, Input } from 'rain-svelte-components/package';
	import { Eye, EyeSlash } from '@steeze-ui/heroicons';

	let loading = false;
	let email: string;
	let password: string;
	let errorMessage: string;

	let show_password = false;
	$: type = show_password ? 'text' : 'password';
	$: hideIcon = show_password ? EyeSlash : Eye;

	const handleLogin = async () => {
		try {
			errorMessage = null;
			loading = true;
			const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
			if (error) throw error;
			goto('/');
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
				// alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<form class="flex flex-col gap-y-4 w-80" on:submit|preventDefault={handleLogin}>
	<div class="flex flex-col gap-y-2">
		<h1 class="text-2xl font-semibold">Welcome back</h1>
		<p class="text-gray-700 text-sm">Sign into your account</p>
	</div>
	<Input bind:value={email} placeholder="you@example.com">
		<svelte:fragment slot="label">Email</svelte:fragment>
	</Input>
	<Input
		bind:value={password}
		placeholder="•••••••••••"
		{type}
		iconAction={() => (show_password = !show_password)}
		icon={hideIcon}
		iconPos="end"
	>
		<svelte:fragment slot="label">Password</svelte:fragment>
	</Input>

	{#if errorMessage}
		<span class="text-red-500">{errorMessage}</span>
	{/if}

	<Button variant="primary" disabled={loading} classes="text-center w-full">
		{loading ? 'Signing in' : 'Sign in'}
	</Button>
	<div class="text-center text-sm">
		Don't have an account? <a href="/sign-up" class="underline">Sign up</a>
	</div>
</form>
