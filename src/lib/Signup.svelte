<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from 'rain-svelte-components/package';
	import { fly, fade } from 'svelte/transition';
	import { CheckCircle, Eye, EyeSlash } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	let loading = false;
	let email: string;
	let password: string;
	let username: string;
	let message = '';
	let errors: boolean;
	let errorMessage: string | null;
	let confirmedMessage: string | null;
	let usernameInput: Input;

	let show_password = false;
	$: type = show_password ? 'text' : 'password';
	$: hideIcon = show_password ? EyeSlash : Eye;

	const usernameValidate = async (value: any) => {
		errors = false;
		const { data, error } = await supabaseClient.from('profiles').select('*').eq('username', value);
		if (error) {
			errors = true;
			return { error: 'Something went wrong' };
		}
		if (data && data.length) {
			errors = true;
			return { error: "Username isn't available" };
		}
	};

	// const emailValidate = async (value: any) => {
	// 	errors = false;
	// 	const { data, error } = await supabaseClient
	// 		.from('profiles')
	// 		.select('*, id!inner(email)')
	// 		.eq('id.email', value);
	// 	console.log(data, error);
	// 	if (error) {
	// 		errors = true;
	// 		return { error: 'Something went wrong' };
	// 	}
	// 	if (data && data.length) {
	// 		errors = true;
	// 		return { error: 'Email already registered' };
	// 	}
	// };

	const handleResgister = async () => {
		try {
			await usernameInput.validate();
			loading = true;
			errorMessage = null;
			const { data, error } = await supabaseClient.auth.signUp({
				email,
				password,
				options: {
					data: {
						username
					}
				}
			});

			if (error) {
				throw error;
			} else if (data.user?.identities?.length === 0) {
				throw new Error('Email already registered');
			}
			confirmedMessage = 'A confirmation email has been sent';
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
				// alert(error.message);
			}
		} finally {
			loading = false;
			// alert(message);
		}
	};
</script>

<div
	class="bg-white rounded-xl p-8 border border-gray-200 -mt-20"
	in:fly={{ y: 20, duration: 1000 }}
>
	{#if !confirmedMessage}
		<form class="flex flex-col" on:submit|preventDefault={handleResgister}>
			<div class="flex flex-col gap-y-4 w-80">
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold">Get started with Rain</h1>
					<p class="text-gray-700 text-sm">Sign up for an account</p>
				</div>
				<Input bind:value={email} placeholder="you@example.com">
					<svelte:fragment slot="label">Email</svelte:fragment>
				</Input>
				<Input
					bind:this={usernameInput}
					bind:value={username}
					placeholder="raindrop69"
					validator={usernameValidate}
				>
					<svelte:fragment slot="label">Username</svelte:fragment>
				</Input>
				<Input
					icon={hideIcon}
					iconPos="end"
					iconAction={() => (show_password = !show_password)}
					bind:value={password}
					placeholder="•••••••••••"
					{type}
				>
					<svelte:fragment slot="label">Password</svelte:fragment>
				</Input>
				{#if errorMessage}
					<div in:fade class="text-red-500">{errorMessage}</div>
				{/if}
				<Button variant="primary" classes="text-center w-full" disabled={loading || errors}>
					{loading ? 'Loading' : 'Sign up'}
				</Button>
				<div class="text-center text-sm">
					Have an account? <a href="/sign-in" class="underline">Sign in</a>
				</div>
			</div>
		</form>
	{:else}
		<div in:fade class="w-80 flex flex-col gap-y-4">
			<div class="text-green-600 w-20">
				<Icon src={CheckCircle} />
			</div>
			<div class="text-2xl">
				{confirmedMessage}
			</div>
			<div class="text-gray-700">Don't see the email? Check your spam folder.</div>
		</div>
	{/if}
</div>
