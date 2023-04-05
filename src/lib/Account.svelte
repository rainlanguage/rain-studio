<script lang="ts">
	import { onMount } from 'svelte';
	import type { AuthSession } from '@supabase/supabase-js';
	import { supabaseClient } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { Button, Input } from 'rain-svelte-components';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowRightOnRectangle, TableCells } from '@steeze-ui/heroicons';

	export let session: AuthSession;

	let loading = false;
	let username: string | null = null;
	let fullname: string | null = null;
	let website: string | null = null;
	let avatarUrl: string | null = null;

	onMount(() => {
		getProfile();
	});

	const getProfile = async () => {
		try {
			loading = true;
			const { user } = session;

			const { data, error, status } = await supabaseClient
				.from('wallet_users')
				.select(`username, full_name, website, avatar_url`)
				.eq('id', user.id)
				.single();

			if (data) {
				username = data.username;
				website = data.website;
				avatarUrl = data.avatar_url;
				fullname = data.full_name;
			}

			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	};

	async function updateProfile() {
		try {
			loading = true;
			const { user } = session;

			const updates = {
				id: user.id,
				username,
				website,
				avatar_url: avatarUrl,
				updated_at: new Date(),
				full_name: fullname
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

	async function signOut() {
		try {
			loading = true;
			let { error } = await supabaseClient.auth.signOut();
			if (error) throw error;
			goto('/signout');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex w-max flex-col space-y-3 rounded-lg bg-white p-6 shadow-md">
	<div class="w-full border-b-2 border-double border-gray-300 pb-4">
		<a
			class="mx-auto flex w-5/6 rounded-[10px] border border-neutral-300 bg-blue-500 py-1 text-white hover:bg-blue-400"
			href={`/user/${username}/expressions`}
		>
			<Icon class="h-6 w-4/12" src={TableCells} />
			Expressions
		</a>
	</div>

	<form
		class="form-widget space-y-4 border-b-2 border-double border-gray-300 pb-4"
		on:submit|preventDefault={updateProfile}
	>
		<div id="email">
			<Input value={session.user.email} disabled>
				<span slot="label">Email</span>
			</Input>
		</div>
		<div id="username">
			<Input bind:value={username}>
				<span slot="label">User name</span>
			</Input>
		</div>
		<div id="fullname">
			<Input bind:value={fullname}>
				<span slot="label">Full name</span>
			</Input>
		</div>
		<div id="website">
			<Input type="website" bind:value={website}>
				<span slot="label">Website</span>
			</Input>
		</div>
		<div id="avatarUrl">
			<Input bind:value={avatarUrl}>
				<span slot="label">Avatar Url</span>
			</Input>
		</div>

		<div class="mx-auto w-max">
			<Button size="small" variant="secondary" disabled={loading}
				>{loading ? 'Loading...' : 'Update'}</Button
			>
		</div>
	</form>

	<div class="mx-auto">
		<Button size="small" icon={ArrowRightOnRectangle} on:click={signOut} disabled={loading}
			>Sign Out</Button
		>
	</div>
</div>
