<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Button, Modal } from 'rain-svelte-components/package';
	import { afterNavigate } from '$app/navigation';

	import NewOrgModal from '$lib/user-context/NewOrgModal.svelte';

	let openCreateModal = !!$page.data.create;
	onMount(() => {
		console.log($page.data);
	});

	afterNavigate(() => {
		openCreateModal = $page.data.create;
	});
</script>

<NewOrgModal bind:open={openCreateModal} />

Organizations
