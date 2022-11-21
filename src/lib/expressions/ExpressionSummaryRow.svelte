<script lang="ts">
	import { goto } from '$app/navigation';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	// import TimeAgo from '$lib/TimeAgo.svelte';
	import { DocumentDuplicate, PaperAirplane, Trash } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';
	import { createEventDispatcher } from 'svelte';

	export let expression: any;
	const dispatch = createEventDispatcher();

	let deleteExpressionModal: boolean = false;

	const deleteExp = () => {
		deleteExpressionModal = true;
	};

	const confirmDelete = async () => {
		const action = await supabaseClient.from('draft_expressions').delete().eq('id', expression.id);
		if (action?.error) {
			alert(action.error);
		} else {
			deleteExpressionModal = false;
			dispatch('deleted');
		}
	};
</script>

<div class="flex flex-col xl:flex-row border border-gray-200 p-5 rounded-lg gap-x-4 gap-y-4">
	<div class="w-96 flex flex-col gap-y-3">
		<span class="text-xl font-medium">{expression.name}</span>
		<!-- <TimeAgo dateString={expression.created_at} /> -->
		<span>{expression.notes}</span>
		<div class="flex gap-x-2 items-center text-sm">
			<ProjectTag
				name={expression.contract.project.name}
				logoUrl={expression.contract.project.logo_url}
			/>
			<span>{expression.contract.metadata.name}</span>
		</div>
		<Pills><span class="text-sm">{expression.interpreter.metadata.name}</span></Pills>
		<div class="mt-4 flex gap-x-2">
			<Button size="small" variant="transparent" icon={DocumentDuplicate}>Fork</Button>
			<Button
				on:click={() => {
					goto(`/expression/draft/${expression.sharable_slug}`);
				}}
				size="small"
				variant="transparent"
				icon={PaperAirplane}>Share</Button
			>
			<Button on:click={deleteExp} size="small" variant="transparent" icon={Trash}>Delete</Button>
		</div>
	</div>
	<div class="w-full h-full">
		<Formatter raw={expression.raw_expression} />
	</div>
</div>

<Modal bind:open={deleteExpressionModal}>
	<div class="flex flex-col gap-y-2">
		<span class="text-2xl">Delete expression</span>
		<span>Are you sure you want to delete this expression? This can't be undone.</span>
		<div class="flex gap-x-2 mt-4">
			<Button variant="primary" on:click={confirmDelete}>Delete</Button><Button
				on:click={() => {
					deleteExpressionModal = false;
				}}>Cancel</Button
			>
		</div>
	</div>
</Modal>
