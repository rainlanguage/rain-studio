
<script>
	import { page } from '$app/stores';
	import Account from '$lib/Account.svelte';
</script>
<div class="w-full flex-grow bg-gray-100 flex flex-col items-center justify-center">
	<Account session={$page.data.session} />
</div>

