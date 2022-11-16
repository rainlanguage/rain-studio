
<script>
	import { page } from '$app/stores';
	import Account from '$lib/Account.svelte';
	import Background from '$lib/Background.svelte';
</script>
<Background>
	<Account session={$page.data.session} />
</Background>

