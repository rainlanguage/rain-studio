<script>
	import { page } from '$app/stores';
	import Account from '$lib/Account.svelte';
</script>

<Account session={$page.data.session} />
