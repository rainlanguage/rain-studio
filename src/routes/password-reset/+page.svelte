<script lang="ts">
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import { Button, Input } from '@rainprotocol/rain-svelte-components';
	import { supabaseClient } from '$lib/supabaseClient';

	$: session = $page.data.session;

	let password: string;

	const resetPassword = async () => {
		await supabaseClient.auth.updateUser({ password });
		alert('password updated!');
	};
</script>

<Background alignItems="items-start">
	<div class="w-96">
		<Input bind:value={password} />
		<Button on:click={resetPassword}>Reset password</Button>
	</div>
</Background>
