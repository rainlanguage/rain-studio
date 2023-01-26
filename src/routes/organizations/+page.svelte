<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import NewOrgModal from '$lib/user-context/NewOrgModal.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let openCreateModal: boolean = data.create;

	afterNavigate(() => {
		openCreateModal = data.create;
	});
</script>

<NewOrgModal bind:open={openCreateModal} />

Organizations
