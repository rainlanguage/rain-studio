<script lang="ts">
	import Background from '$lib/Background.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from 'rain-svelte-components/package';

	let email: string;
	const requestReset = () => {
		supabaseClient.auth.resetPasswordForEmail(email, {
			redirectTo: 'http://127.0.0.1:5173/password-reset'
		});
	};
</script>

<Background>
	<div class="w-96 bg-white rounded-lg">
		<span>Reset your password</span>
		<Input bind:value={email} />
		<Button on:click={requestReset}>Request reset</Button>
	</div>
</Background>
