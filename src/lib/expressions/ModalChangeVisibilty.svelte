<script lang="ts">
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button } from '@rainprotocol/rain-svelte-components';
	import { Modal } from '@rainprotocol/rain-svelte-components';
	import { createEventDispatcher } from 'svelte';
	import { CheckCircle, ExclamationCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	const dispatch = createEventDispatcher();
	export let expression: any;
	export let isOpen: boolean = false,
		isSuccess: boolean = false,
		isFailure: boolean = false;

	const changeVisibility = async () => {
		const action = await supabaseClient
			.from('draft_expressions_w')
			.update({ public: !expression.public })
			.eq('id', expression.id);

		if (action?.error) {
			isFailure = true;
		} else {
			isSuccess = true;
			dispatch('visibilyChanged');
		}

		isOpen = false;
	};
</script>

<!-- Modal to confirm modify visibility -->
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
		<div class="mt-4 flex gap-x-2">
			<Button variant="primary" on:click={changeVisibility}>Change visibility</Button>
			<Button
				on:click={() => {
					isOpen = false;
				}}>Cancel</Button
			>
		</div>
	</div>
</Modal>

<!-- Modal on success -->
<Modal bind:open={isSuccess}>
	<div class="flex flex-col items-center gap-y-3">
		<span class="text-2xl">Visibility changed</span>

		<div class="mb-2 w-16 text-green-500">
			<Icon src={CheckCircle} />
		</div>

		<span>
			Now your expression is {expression.public ? 'public' : 'private'}
		</span>

		<div>
			<Button
				on:click={() => {
					isSuccess = false;
				}}>Continue</Button
			>
		</div>
	</div>
</Modal>

<!-- Modal on failure -->
<Modal bind:open={isFailure}>
	<div class="flex flex-col items-center gap-y-3">
		<span class="text-2xl">The visibility was not changed</span>

		<div class="mb-2 w-16 text-red-500">
			<Icon src={ExclamationCircle} />
		</div>

		<div>
			<Button
				on:click={() => {
					isFailure = false;
				}}>Continue</Button
			>
		</div>
	</div>
</Modal>
