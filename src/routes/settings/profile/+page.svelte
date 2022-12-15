<script lang="ts">
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from 'rain-svelte-components/package';
	import UserAvatar from '$lib/UserAvatar.svelte';

	let user = $page.data.profile;

	let username: string = user?.username;
	let avatarUrl: string | null = user?.avatar_url;
	let fullName: string | null = user?.full_name;
	let website: string | null = user?.website;

	let loading = false;
	let isValid = false;

	let usernameInput: Input;

	const usernameValidate = async (value: string) => {
		const { data, error } = await supabaseClient
			.from('wallet_users')
			.select('*')
			.eq('username', value.toLowerCase());

		if (error) {
			isValid = false;
			return { error: 'Something went wrong' };
		}

		if (data && data.length) {
			isValid = false;
			return { error: "Username isn't available" };
		}

		isValid = true;
	};

	async function updateProfile() {
		try {
			loading = true;

			await usernameInput.validate();
			const _username = username.toLowerCase();

			const updates = {
				id: user?.id,
				username: _username,
				avatar_url: avatarUrl,
				full_name: fullName,
				website: website
			};

			let { error } = await supabaseClient.from('wallet_users').upsert(updates);

			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex flex-col w-max gap-y-6">
	<form class="flex flex-col gap-y-4 w-96" on:submit|preventDefault={updateProfile}>
		<div class="flex items-center gap-x-3">
			<UserAvatar url={avatarUrl} size={70} />
			<span>Change profile image</span>
		</div>
		<Input bind:this={usernameInput} bind:value={username} validator={usernameValidate}>
			<svelte:fragment slot="label">Username</svelte:fragment>
		</Input>

		<Input bind:value={fullName}>
			<span slot="label">Full name</span>
		</Input>
		<Input bind:value={website}>
			<span slot="label">Website</span>
		</Input>

		<Button variant="black" classes="self-start" disabled={!isValid}
			>{loading ? 'Loading...' : 'Update'}</Button
		>
	</form>
</div>
