<script lang="ts">
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from 'rain-svelte-components/package';
	import UserAvatar from '$lib/UserAvatar.svelte';

	let session = $page.data.session;
	let profile = $page.data.profile;

	let loading = false;
	let username: string | null = profile.username;
	let avatarUrl: string | null = profile.avatar_url;

	async function updateProfile() {
		try {
			loading = true;
			const { user } = session;

			const updates = {
				id: user.id,
				username,
				avatar_url: avatarUrl,
				updated_at: new Date()
			};

			let { error } = await supabaseClient.from('profiles').upsert(updates);

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
	<form class="flex flex-col gap-y-8 w-96" on:submit|preventDefault={updateProfile}>
		<div class="flex items-center gap-x-3">
			<UserAvatar url={avatarUrl} size={70} />
			<span>Change profile image</span>
		</div>
		<Input value={session.user.email} disabled>
			<span slot="label">Email</span>
		</Input>
		<Input bind:value={username}>
			<svelte:fragment slot="label">Username</svelte:fragment>
		</Input>
		<Button classes="self-start" disabled={loading}>{loading ? 'Loading...' : 'Update'}</Button>
		<a class="text-sm underline text-gray-500" href="/request-reset">Reset password</a>
	</form>
</div>
