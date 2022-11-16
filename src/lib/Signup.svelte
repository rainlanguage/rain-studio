<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from 'rain-svelte-components/package';
	import { fly } from 'svelte/transition';
	import { Eye, EyeSlash } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';



	let loading = false;
	let email: string;
	let password: string;
	let message = '';

	let show_password = false
	$: type = show_password ? 'text' : 'password'
	$: hideIcon = show_password ? EyeSlash : Eye

	const handleResgister = async () => {
		try {
			loading = true;
			const {data, error} = await supabaseClient.auth.signUp({ email, password });

			if (error) {
				throw error
			} else if (data.user?.identities?.length === 0) {
				throw new Error('Email already registered');
			}
			message = 'A confirmation email has been sent';
		} catch (error) {
			if (error instanceof Error) {
				message = error.message
				// alert(error.message);
			}
		} finally {
			loading = false;
			alert(message);
		}
	};


</script>

<form
	in:fly={{ y: 20, duration: 1000 }}
	class="flex flex-col bg-white p-6 rounded-lg shadow-md"
	on:submit|preventDefault={handleResgister}
>
	<div class="flex flex-col gap-y-6">
		<h1 class="text-2xl">Sign up to Rain Studio</h1>
		<p class="description">Register an user via email</p>
		<Input bind:value={email} placeholder="Your email"/>
		<div class="flex w-full rounded-md bg-gray-200 dark:bg-gray-800">
				<Input bind:value={password} placeholder="Your password" {type} />
				<button type="button" on:click={ () => show_password = !show_password }>
					<Icon
						src={hideIcon}
						class="cursor-pointer h-6 px-2"
					/>
				</button>
		</div>
		<Button>
			<input type="submit" value={loading ? 'Loading' : 'Sign up'} disabled={loading} />
		</Button>
	</div>
</form>
