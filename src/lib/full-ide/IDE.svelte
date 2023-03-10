<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { breakpoint, Breakpoints } from '$lib/breakpoint-stores';
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import { copyAndEmit } from '$lib/expressions/expressions';
	import ForkExpression from '$lib/expressions/ForkExpression.svelte';
	import ModalChangeVisibilty from '$lib/expressions/ModalChangeVisibilty.svelte';
	import ContextGrid from '$lib/full-ide/ContextGrid.svelte';
	import MobileTabButton from '$lib/full-ide/MobileTabButton.svelte';
	import PanelHeader from '$lib/full-ide/PanelHeader.svelte';
	import SignedContext from '$lib/full-ide/SignedContext.svelte';
	import { ShowPane } from '$lib/full-ide/types';
	import HelpPanel from '$lib/HelpPanel.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import Tags from '$lib/Tags.svelte';
	import type { ExpressionRowFull } from '$lib/types/types';
	import {
		ArrowPath,
		ArrowUturnLeft,
		Beaker,
		CodeBracket,
		DocumentDuplicate,
		DocumentText,
		Eye,
		InformationCircle,
		Lifebuoy,
		LockClosed,
		LockOpen,
		PaperAirplane,
		Pencil,
		QuestionMarkCircle,
		TableCells
	} from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { throttle } from 'lodash-es';
	import type { StateConfig } from 'rain-metadata/type-definitions/expression';
	import { Button, Modal, OpDocs, ParserInput } from 'rain-svelte-components/package';
	import { OverflowMenu, OverflowMenuItem } from 'rain-svelte-components/package/overflow-menu';
	import SimulatedOutput from 'rain-svelte-components/package/parser/SimulatedOutput.svelte';
	import { tick } from 'svelte';
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import type { Writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	export let expression: ExpressionRowFull;
	export let closeCallback: Function;
	export let asModal: boolean = false;

	let raw_expression = expression.raw_expression || '';
	let vmStateConfig: Writable<StateConfig>;
	let notes = expression.notes || '';
	let name = expression.name || '';
	let contract_expression = expression?.contract_expression;
	let tags: string[] = expression?.tags || [];
	let changeVisiblityModal: boolean = false;

	// get from the metadata whether the expression type has a signed context
	$: hasSignedContext =
		expression.contract?.metadata.expressions?.find(
			(_expression) => _expression.name == expression.contract_expression
		)?.signedContext || !expression.contract;

	// get the contextColumns from the metadata for this expressoin type
	$: contextColumns = expression.contract?.metadata.expressions?.find(
		(exp) => exp.name == expression.contract_expression
	)?.contextColumns;

	// merging contract base context and dynamic signed context
	let mockContext: any = expression.saved_context?.mockContext || [],
		signedContext: any = expression.saved_context?.signedContext || [
			['', ''],
			['', '']
		];
	$: context = mockContext || signedContext ? [...mockContext, ...signedContext] : 0;
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
			.from('draft_expressions_w')
			.update({ raw_expression, notes, saved_context, tags })
			.eq('id', expression.id);

		setTimeout(() => {
			saving = false;
		}, 400);
	};

	const throttledSave = throttle(save, 2000);
	$: if ((raw_expression || notes || saved_context || tags) && !asModal)
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
		await supabaseClient.from('draft_expressions_w').update({ name }).eq('id', expression.id);
		setTimeout(() => {
			saving = false;
		}, 400);
	};

	const back = () => {
		if (closeCallback) closeCallback(raw_expression);
		else goto(`/user/${$page.data.profile.username}/expressions`);
	};

	let saveACopy: boolean = false;

	// code for showing different panes on mobile
	let mobileActivePane = ShowPane.Expression;

	$: isMobile = $breakpoint < Breakpoints.md;
</script>

<div class="flex flex-grow flex-col">
	<div class="flex items-stretch justify-between">
		<div class="flex items-stretch">
			<div class="flex flex-col justify-center border-r border-gray-300">
				<button on:click={back} class="flex items-center gap-x-1 p-3">
					<div class="w-3">
						<Icon src={ArrowUturnLeft} />
					</div>
					<span class="hidden md:block">Back</span>
				</button>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			{#if !asModal}
				<div class="flex items-center gap-x-1 p-3">
					{#if editingName}
						<input
							on:focusout={saveName}
							bind:value={name}
							bind:this={nameInput}
							on:keyup={({ code }) => {
								if (code == 'Enter') saveName();
							}}
							class="text-sm md:text-base"
						/>
					{:else}
						<span class="cursor-pointer text-sm md:text-base" on:click={editName}>{name}</span>
						<div on:click={editName} class="w-3 cursor-pointer">
							<Icon theme="solid" src={Pencil} />
						</div>
					{/if}
				</div>
				<div class="flex items-center gap-x-1">
					<span class="hidden text-[14px] text-gray-600 md:block">
						{expression.public ? 'Public' : 'Private'}
					</span>
					<div class="mr-3 w-3.5 pb-0.5">
						<Icon src={expression.public ? LockOpen : LockClosed} />
					</div>
				</div>
			{/if}
			{#if saving}
				<div
					class="fixed left-0 right-0 bottom-3 flex flex-row justify-center self-center md:relative md:bottom-auto md:left-auto md:right-auto md:flex-col md:items-center"
				>
					<div
						transition:fade={{ duration: 100 }}
						class="mx-auto flex items-center gap-x-1 rounded-xl border border-gray-200 bg-gray-100 p-1"
					>
						<div class="w-4 animate-spin text-gray-500">
							<Icon src={ArrowPath} />
						</div>
						<span class="text-xs text-gray-500">Saving</span>
					</div>
				</div>
			{/if}
		</div>
		<div class="flex gap-x-2 py-3 px-3">
			{#if !asModal}
				<OverflowMenu position="right">
					<OverflowMenuItem icon={Eye} href={`/expression/draft/${expression.sharable_slug}`}>
						View
					</OverflowMenuItem>
					<OverflowMenuItem
						icon={PaperAirplane}
						on:click={() => {
							copyAndEmit(
								`${$page.url.origin}/expression/draft/${expression.sharable_slug}`,
								'Link copied to clipboard'
							);
						}}
					>
						Share
					</OverflowMenuItem>
					<OverflowMenuItem
						on:click={() => {
							saveACopy = true;
						}}
						icon={DocumentDuplicate}
					>
						Save a copy
					</OverflowMenuItem>
					<OverflowMenuItem
						icon={expression.public ? LockClosed : LockOpen}
						on:click={() => (changeVisiblityModal = true)}
					>
						Make {expression.public ? 'private' : 'public'}
					</OverflowMenuItem>
				</OverflowMenu>
			{/if}
			<OverflowMenu position="right" autoWidth>
				<svelte:fragment slot="button">
					<Button variant="transparent" icon={QuestionMarkCircle} size="small">Help</Button>
				</svelte:fragment>
				<div class="p-4">
					<HelpPanel />
				</div>
			</OverflowMenu>
		</div>
	</div>

	<div class="flex flex-grow items-stretch">
		<div class="relative flex-grow overflow-hidden bg-red-100">
			<Splitpanes
				theme="modern-theme"
				style="position: absolute; top: 0; bottom: 0; left:0; right:0;"
			>
				{#if !(isMobile && !(mobileActivePane == ShowPane.Environment))}
					<Pane size={isMobile ? 100 : 25} minSize={15}>
						<div class="flex flex-col border-t border-gray-300 bg-white">
							<div class="flex flex-col gap-y-2 border-b border-gray-300 py-4 px-2">
								<span class="text-[10px] uppercase text-gray-600">Writing for</span>
								<ExpressionEnv {expression} />
							</div>
						</div>
					</Pane>
				{/if}
				{#if !(isMobile && !(mobileActivePane == ShowPane.Expression || mobileActivePane == ShowPane.MockData || mobileActivePane == ShowPane.Notes))}
					<Pane size={isMobile ? 100 : undefined} minSize={10}>
						<Splitpanes horizontal firstSplitter theme="modern-theme">
							{#if !(isMobile && !(mobileActivePane == ShowPane.Expression))}
								<Pane size={isMobile ? 100 : 50} minSize={10}>
									<div class="flex h-full flex-col">
										<PanelHeader>Expression</PanelHeader>
										<div class="flex min-h-0 flex-grow flex-col overflow-scroll p-2">
											<ParserInput bind:raw={raw_expression} bind:vmStateConfig />
										</div>
									</div>
								</Pane>
							{/if}
							{#if !(isMobile && !(mobileActivePane == ShowPane.MockData))}
								<Pane size={isMobile ? 100 : 30} minSize={10}>
									<div class="h-full">
										<PanelHeader>Mock data</PanelHeader>
										<div class="h-full overflow-scroll p-2">
											{#if contextColumns}
												<div class="pt-4 pb-2 text-xs uppercase text-gray-500">Context</div>
												<ContextGrid {contextColumns} bind:mockContext />
											{/if}
											{#if hasSignedContext}
												<div class="pt-4 pb-2 text-xs uppercase text-gray-500">
													{expression.contract ? 'Signed context' : 'Context'}
												</div>
												<SignedContext bind:signedContext />
											{/if}
										</div>
									</div>
								</Pane>
							{/if}
							{#if !asModal}
								{#if !(isMobile && !(mobileActivePane == ShowPane.Notes))}
									<Pane size={isMobile ? 100 : 20} minSize={10}>
										<div class="flex h-full flex-grow flex-col">
											<PanelHeader>Notes</PanelHeader>
											<div class="flex flex-grow flex-col gap-y-2 p-2">
												<Tags bind:tags onlyUnique labelShow allowBlur labelText="Tags" />
												<textarea
													class="flex-grow self-stretch justify-self-stretch whitespace-pre-wrap outline-0"
													bind:value={notes}
													placeholder="Click here to add notes"
												/>
											</div>
										</div>
									</Pane>
								{/if}
							{/if}
						</Splitpanes>
					</Pane>
				{/if}
				{#if !(isMobile && !(mobileActivePane == ShowPane.Simulator || mobileActivePane == ShowPane.Docs))}
					<Pane size={isMobile ? 100 : 25} minSize={15}>
						<Splitpanes horizontal firstSplitter theme="modern-theme">
							{#if !(isMobile && !(mobileActivePane == ShowPane.Simulator))}
								<Pane size={isMobile ? 100 : 50} minSize={10}>
									<div class="flex h-full flex-grow flex-col">
										<PanelHeader>Simulator</PanelHeader>
										<div class="relative flex-grow overflow-y-scroll p-2">
											<SimulatedOutput {vmStateConfig} {context} />
										</div>
									</div>
								</Pane>
							{/if}
							{#if !(isMobile && !(mobileActivePane == ShowPane.Docs))}
								<Pane size={isMobile ? 100 : 50} minSize={10}>
									<div class="flex h-full flex-grow flex-col">
										<div class="flex-shrink">
											<PanelHeader>Available words</PanelHeader>
										</div>
										<div class="relative flex-grow">
											<div class="absolute inset-0">
												<OpDocs />
											</div>
										</div>
									</div>
								</Pane>
							{/if}
						</Splitpanes>
					</Pane>
				{/if}
			</Splitpanes>
		</div>
		<div
			class="borderg-gray-300 flex flex-col justify-items-start border-l border-t bg-gray-100 p-1 md:hidden"
		>
			<MobileTabButton icon={CodeBracket} pane={ShowPane.Expression} bind:mobileActivePane />
			<MobileTabButton icon={InformationCircle} pane={ShowPane.Environment} bind:mobileActivePane />
			<MobileTabButton icon={Beaker} pane={ShowPane.Simulator} bind:mobileActivePane />
			<MobileTabButton icon={TableCells} pane={ShowPane.MockData} bind:mobileActivePane />
			<MobileTabButton icon={DocumentText} pane={ShowPane.Notes} bind:mobileActivePane />
			<MobileTabButton icon={Lifebuoy} pane={ShowPane.Docs} bind:mobileActivePane />
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

<ModalChangeVisibilty
	on:visibilyChanged={() => (expression.public = !expression.public)}
	{expression}
	bind:isOpen={changeVisiblityModal}
/>

<style lang="postcss" global>
	.splitpanes.modern-theme .splitpanes__pane {
		background-color: #ffffff;
	}
	.splitpanes.modern-theme .splitpanes__splitter {
		@apply bg-gray-300;
		position: relative;
	}

	.splitpanes.modern-theme .splitpanes__splitter:before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		transition: opacity 0.4s;
		@apply bg-blue-400;
		opacity: 0;
		z-index: 1;
	}
	.splitpanes.modern-theme .splitpanes__splitter:hover:before {
		opacity: 1;
	}
	.splitpanes.modern-theme .splitpanes__splitter__active {
		z-index: 100; /* Fix an issue of overlap fighting with a near hovered splitter */
	}

	.modern-theme.splitpanes--vertical > .splitpanes__splitter:before {
		left: -3px;
		right: -3px;
		height: 100%;
		cursor: col-resize;
	}
	.modern-theme.splitpanes--horizontal > .splitpanes__splitter:before {
		top: -3px;
		bottom: -3px;
		width: 100%;
		cursor: row-resize;
	}
</style>
