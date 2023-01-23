<script lang="ts">
	import type { ProfileRow } from '$lib/types/types';
	import UserAvatar from '$lib/UserAvatar.svelte';

	export let user: ProfileRow;
</script>

<div class="flex gap-x-2">
	<UserAvatar url={user.avatar_url} />
	<span>{user.username}</span>
</div>
