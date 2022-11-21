<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { Button, Input } from 'rain-svelte-components/package';
	import { fly } from 'svelte/transition';
	import { Eye, EyeSlash, ArrowLeftOnRectangle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	let loading = false;
	let email: string;
	let password: string;

	let show_password = false;
	$: type = show_password ? 'text' : 'password';
	$: hideIcon = show_password ? EyeSlash : Eye;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
			if (error) throw error;
			alert('Logged');
			goto('/profile');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<form class="flex flex-col gap-y-6" on:submit|preventDefault={handleLogin}>
	<h1 class="text-2xl">Log in to Rain Studio</h1>
	<p class="description">Enter to your user using the email</p>
	<Input bind:value={email} placeholder="Your email" />
	<div class="flex w-full rounded-md bg-gray-200 dark:bg-gray-800">
		<Input bind:value={password} placeholder="Your password" {type} />
		<button type="button" on:click={() => (show_password = !show_password)}>
			<Icon src={hideIcon} class="cursor-pointer h-6 px-2" />
		</button>
	</div>

	<div class="w-fit mx-auto">
		<Button icon={ArrowLeftOnRectangle} disabled={loading}>
			{loading ? 'Loading' : 'Log in'}
		</Button>
	</div>
</form>
