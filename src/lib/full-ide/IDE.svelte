<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import PanelHeader from '$lib/full-ide/PanelHeader.svelte';
	import {
		ArrowPath,
		ArrowUturnLeft,
		PaperAirplane,
		Pencil,
		QuestionMarkCircle
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Button, Modal, OpDocs, ParserInput } from 'rain-svelte-components/package';
	import { throttle } from 'lodash-es';
	import { supabaseClient } from '$lib/supabaseClient';
	import { tick } from 'svelte';
	import type { ExpressionRowFull } from '$lib/types/types';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import ContextGrid from '$lib/full-ide/ContextGrid.svelte';
	import SignedContext from '$lib/full-ide/SignedContext.svelte';
	import Tags from '$lib/Tags.svelte';
	export let expression: ExpressionRowFull;

	let raw_expression = expression.raw_expression || '';
	let notes = expression.notes || '';
	let name = expression.name || '';
	let contract_expression = expression?.contract_expression;
	let tags: string[] = expression?.tags || [''];

	// get from the metadata whether the expression type has a signed context
	$: hasSignedContext = expression.contract?.metadata.expressions?.find(
		(_expression) => _expression.name == expression.contract_expression
	)?.signedContext;

	// get the contextColumns from the metadata for this expressoin type
	$: contextColumns = expression.contract?.metadata.expressions?.find(
		(exp) => exp.name == expression.contract_expression
	)?.contextColumns;

	// merging contract base context and dynamic signed context
	let mockContext: any = expression.saved_context?.mockContext,
		signedContext: any = expression.saved_context?.signedContext || [
			['', ''],
			['', '']
		];
	$: context = mockContext && signedContext ? [...mockContext, ...signedContext] : 0;
	$: saved_context = { mockContext, signedContext };

	// for saving the exression and notes - this happens automatically as the user edits
	let saving: boolean; // track saving state

	const save = async (
		raw_expression: string,
		notes: string,
		saved_context: any,
		tags: string[]
	) => {
		saving = true;
		await supabaseClient
			.from('draft_expressions')
			.update({ raw_expression, notes, saved_context, tags })
			.eq('id', expression.id);

		setTimeout(() => {
			saving = false;
		}, 400);
	};

	const throttledSave = throttle(save, 2000);
	$: if (raw_expression || notes || saved_context || tags)
		throttledSave(raw_expression, notes, saved_context, tags);

	// for saving the expression name - this happens when they blur focus on the name input
	let editingName: boolean;
	let nameInput: HTMLInputElement;

	const editName = async () => {
		editingName = true;
		await tick();
		nameInput.focus();
	};

	const saveName = async () => {
		editingName = false;
		saving = true;
		await supabaseClient.from('draft_expressions').update({ name }).eq('id', expression.id);
		setTimeout(() => {
			saving = false;
		}, 400);
	};

	let saveACopy: boolean = false;

	// handling sharing a link
	const copyShareLink = async () => {
		await navigator.clipboard.writeText(
			`${$page.url.origin}/expression/draft/${expression.sharable_slug}`
		);
		toast.push('Link copied to clipboard');
	};
</script>

<div class="flex justify-between border-b border-gray-300">
	<div class="flex items-center">
		<button
			on:click={() => {
				goto(`/user/${$page.data.profile.username}/expressions`);
			}}
			class="flex gap-x-1 items-center p-3"
		>
			<div class="w-3">
				<Icon src={ArrowUturnLeft} />
			</div>
			<span>Back</span>
		</button>
		<div class="h-full border-l border-gray-300" />
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="p-3 flex gap-x-1 items-center">
			{#if editingName}
				<input
					on:focusout={saveName}
					bind:value={name}
					bind:this={nameInput}
					on:keyup={({ code }) => {
						if (code == 'Enter') saveName();
					}}
				/>
			{:else}
				<span class="cursor-pointer" on:click={editName}>{name}</span>
				<div on:click={editName} class="w-3 cursor-pointer">
					<Icon theme="solid" src={Pencil} />
				</div>
			{/if}
		</div>
		{#if saving}
			<div
				transition:fade={{ duration: 100 }}
				class="flex items-center bg-gray-100 border border-gray-200 rounded-xl gap-x-1 p-1"
			>
				<div class="animate-spin w-4 text-gray-500">
					<Icon src={ArrowPath} />
				</div>
				<span class="text-xs text-gray-500">Saving</span>
			</div>
		{/if}
	</div>
	<div class="flex gap-x-2 py-3 px-3">
		<Button
			on:click={() => {
				saveACopy = true;
			}}
			variant="transparent"
			size="small">Save a copy</Button
		>
		<Button on:click={copyShareLink} variant="transparent" icon={PaperAirplane} size="small"
			>Share</Button
		>
		<Button variant="transparent" icon={QuestionMarkCircle} size="small">Help</Button>
	</div>
</div>

<div class="w-full flex flex-grow items-stretch">
	<div class="flex flex-col w-3/12">
		<div class="flex flex-col gap-y-2 py-4 px-2 border-b border-gray-300">
			<span class="text-gray-600 text-[10px] uppercase">Writing for</span>
			<ExpressionEnv {expression} />
		</div>
	</div>
	<div class="flex flex-col w-5/12 border-x border-gray-300">
		<div class="flex flex-col flex-grow h-[400px] border-b border-gray-300">
			<PanelHeader>Expression</PanelHeader>
			<div class="flex-grow p-2 flex flex-col overflow-scroll">
				<ParserInput bind:raw={raw_expression} />
			</div>
		</div>
		<div class="flex flex-col flex-grow h-1/6 border-b border-gray-300">
			<PanelHeader>Simulator</PanelHeader>
			<div class="flex-grow p-2">Simulator</div>
		</div>
		<div class="flex flex-col flex-grow h-1/3">
			<PanelHeader>Notes</PanelHeader>
			<div class="p-2 flex-col flex flex-grow gap-y-2">
				<Tags bind:tags onlyUnique labelShow labelText="Tags" />
				<textarea
					class="flex-grow self-stretch justify-self-stretch whitespace-pre-wrap outline-0"
					bind:value={notes}
				/>
			</div>
		</div>
	</div>
	<div class="flex flex-col w-4/12">
		<div class="h-96 border-b border-gray-300">
			<PanelHeader>Mock data</PanelHeader>
			<div class="p-2 overflow-scroll h-full">
				{#if contextColumns}
					<ContextGrid {contextColumns} bind:mockContext />
				{/if}
				{#if hasSignedContext}
					<SignedContext bind:signedContext />
				{/if}
			</div>
		</div>
		<div class="flex-col flex flex-grow">
			<div class="flex-shrink">
				<PanelHeader>Available words</PanelHeader>
			</div>
			<div class="flex-grow relative">
				<div class="inset-0 absolute">
					<OpDocs />
				</div>
			</div>
		</div>
	</div>
</div>

<Modal open={saveACopy}>
	<ForkExpression
		expression={{
			...expression,
			raw_expression,
			notes,
			name,
			contract_expression
		}}
	/>
</Modal>
