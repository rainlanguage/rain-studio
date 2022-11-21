<script lang="ts">
	import { page } from '$app/stores';
	import Auth from '$lib/Auth.svelte';
	import SaveExpression from '$lib/expressions/SaveExpression.svelte';
	import PageHeader from '$lib/PageHeader.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import { DocumentDuplicate, PaperAirplane, Trash } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import Modal from 'rain-svelte-components/package/Modal.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';

	$: expression = $page.data.expression;
	$: user = $page.data.user;
	$: contract = $page.data.contract;
	$: interpreter = $page.data.interpreter;

	let openNewExpModal: boolean = false;
	let openSignInModal: boolean = false;

	const fork = () => {
		if ($page.data.session) {
			openNewExpModal = true;
		} else {
			openSignInModal = true;
		}
	};
</script>

<PageHeader>
	<div class="w-full flex justify-between items-center container mx-auto">
		<div class="flex flex-col gap-y-2">
			<span class="text-sm text-gray-500">Draft expression</span>
			<span class="text-2xl font-medium">{expression.name}</span>
			<div class="flex items-center gap-x-2">
				<span>Created by</span>
				<img alt="user avatar" class="w-6 rounded-full inline" src={user.avatar_url} />
				<span>{user.username}</span>
			</div>
			<TimeAgo dateString={expression.created_at} />
		</div>
		<div class="flex gap-x-2">
			<Button on:click={fork} size="small" variant="transparent" icon={DocumentDuplicate}
				>Fork</Button
			>
		</div>
	</div>
</PageHeader>

<div class="container mx-auto">
	<div class="mt-8">
		<div class="gap-y-4 grid grid-cols-2 gap-8">
			<div class="flex flex-col gap-y-4">
				<div class="font-semibold text-xl">Writer's notes</div>
				<div class="whitespace-pre-line">{expression.notes}</div>
				<div class="flex gap-x-4 border-t border-gray-200 pt-4 mt-4 items-center">
					<span>Project:</span>
					<ProjectTag name={contract.project.name} logoUrl={contract.project.logo_url} />
					<span>{contract.metadata.name}</span>
					<Pills><span class="text-sm">{interpreter?.metadata?.name}</span></Pills>
				</div>
			</div>
			<div>
				<div class="w-full flex flex-col gap-y-4">
					<Formatter raw={expression.raw_expression} />
				</div>
			</div>
		</div>
	</div>
</div>

<Modal bind:open={openNewExpModal}>
	<SaveExpression
		forking
		presaveExpression={{
			raw_expression: expression.raw_expression,
			contract,
			interpreter: {
				id: '761f3744-fe08-4e71-b38c-faaf7b447455',
				metadata: { name: 'Rainterpreter' }
			},
			name: expression.name,
			notes: expression.notes
		}}
	/>
</Modal>

<Modal bind:open={openSignInModal}><Auth /></Modal>
