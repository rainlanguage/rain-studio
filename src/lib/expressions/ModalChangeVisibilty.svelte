<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button } from 'rain-svelte-components/package';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let expression: any;
	export let isOpen: boolean = false;

	const changeVisibility = async () => {
		const action = await supabaseClient
			.from('draft_expressions')
			.update({ public: !expression.public })
			.eq('id', expression.id);

		if (action?.error) {
			alert(action.error);
		} else {
			isOpen = false;
			dispatch('visibilyChanged');
		}
	};
</script>

<Modal bind:open={isOpen}>
	<div class="flex flex-col gap-y-2">
		<span class="text-2xl">Make {expression.public ? 'private' : 'public'}</span>
		{#if expression.public}
			<span> Are you sure you want to make private this expression? </span>
			<span> Other users will no longer be able to view or interact with it. </span>
		{:else}
			<span>Are you sure you want to make public this expression? </span>
			<span>
				It will become fully visible to other users and they will be able to interact with it.
			</span>
		{/if}
		<div class="flex gap-x-2 mt-4">
			<Button variant="primary" on:click={changeVisibility}>Change visibility</Button>
			<Button
				on:click={() => {
					isOpen = false;
				}}>Cancel</Button
			>
		</div>
	</div>
</Modal>
