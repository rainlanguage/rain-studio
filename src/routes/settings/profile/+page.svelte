<script lang="ts">
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from '@rainprotocol/rain-svelte-components';
	import UserAvatar from '$lib/UserAvatar.svelte';

	let user = $page.data.profile;

	let username: string = user?.username;
	let avatarUrl: string | null = user?.avatar_url;
	let fullName: string | null = user?.full_name;
	let website: string | null = user?.website;

	let updating = false;
	let usernameInput: Input;

	const usernameValidate = async (value: string) => {
		if (user?.username.toLowerCase() == username.toLowerCase()) {
			return;
		}

		const { data, error } = await supabaseClient
			.from('wallet_users')
			.select('*')
			.eq('username', value.toLowerCase());

		if (error) {
			return { error: 'Something went wrong' };
		}

		if (data && data.length) {
			return { error: "Username isn't available" };
		}
	};

	async function updateProfile() {
		try {
			updating = true;

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

			// Update the data in the component
			user.username = updates.username;
			user.avatar_url = updates.avatar_url;
			user.full_name = updates.full_name;
			user.website = updates.website;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			updating = false;
		}
	}
</script>

<div class="flex w-full flex-col items-stretch gap-y-6">
	<form class="flex w-full max-w-sm flex-col gap-y-4" on:submit|preventDefault={updateProfile}>
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

		<Button variant="black" classes="self-start">{updating ? 'Updating...' : 'Update'}</Button>
	</form>
</div>
