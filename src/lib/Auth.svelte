<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from 'rain-svelte-components/package';
	import { fade, fly } from 'svelte/transition';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabaseClient.auth.signInWithOtp({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};
</script>

<form
	in:fly={{ y: 20, duration: 1000 }}
	class="flex flex-col bg-white p-6 rounded-lg shadow-md"
	on:submit|preventDefault={handleLogin}
>
	<div class="flex flex-col gap-y-6">
		<h1 class="text-2xl">Login to Brainscan</h1>
		<p class="description">Sign in via magic link with your email below</p>
		<Input bind:value={email} placeholder="Your email" />
		<Button>
			<input type="submit" value={loading ? 'Loading' : 'Send my magic link'} disabled={loading} />
		</Button>
	</div>
</form>
