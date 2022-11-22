<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button, Input } from 'rain-svelte-components/package';

	let session = $page.data.session;
	let profile = $page.data.profile;

	let loading = false;
	let username: string | null = profile.username;
	let avatarUrl: string | null = profile.avatar_url;

	// onMount(() => {
	// 	getProfile();
	// });

	// const getProfile = async () => {
	// 	try {
	// 		loading = true;
	// 		const { user } = session;

	// 		const { data, error, status } = await supabaseClient
	// 			.from('profiles')
	// 			.select(`username, full_name, website, avatar_url`)
	// 			.eq('id', user.id)
	// 			.single();

	// 		if (data) {
	// 			username = data.username;
	// 			website = data.website;
	// 			avatarUrl = data.avatar_url;
	// 			fullname = data.full_name;
	// 		}

	// 		if (error && status !== 406) throw error;
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			alert(error.message);
	// 		}
	// 	} finally {
	// 		loading = false;
	// 	}
	// };

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

	// async function signOut() {
	// 	try {
	// 		loading = true;
	// 		let { error } = await supabaseClient.auth.signOut();
	// 		if (error) throw error;
	// 		goto('/signout');
	// 	} catch (error) {
	// 		if (error instanceof Error) {
	// 			alert(error.message);
	// 		}
	// 	} finally {
	// 		loading = false;
	// 	}
	// }
</script>

<div class="flex flex-col w-max gap-y-6">
	<!-- <div class="w-full border-b-2 border-double border-gray-300 pb-4">
		<a
			class="flex w-5/6 py-1 mx-auto text-white rounded-[10px] border border-neutral-300 bg-blue-500 hover:bg-blue-400"
			href={`/user/${username}/expressions`}
		>
			<Icon class="h-6 w-4/12" src={TableCells} />
			Expressions
		</a>
	</div> -->

	<form class="flex flex-col gap-y-8 w-96" on:submit|preventDefault={updateProfile}>
		<div class="flex items-center gap-x-3">
			<img src={avatarUrl} class="w-14 rounded-full" />
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
