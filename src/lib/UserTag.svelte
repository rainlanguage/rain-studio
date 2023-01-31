<script lang="ts">
	import type { Wallet_UsersRow } from '$lib/types/types';
	import UserAvatar from '$lib/UserAvatar.svelte';

	export let user: Wallet_UsersRow;
</script>

<div class="flex gap-x-2">
	<UserAvatar url={user.avatar_url} />
	<span>{user.username}</span>
</div>
