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
	<div class="bg-white rounded-xl p-8 border border-gray-200 -mt-20 space-y-4">
		<span>Reset your password</span>
		<Input bind:value={email} />
		<Button on:click={requestReset}>Request reset</Button>
	</div>
</Background>
