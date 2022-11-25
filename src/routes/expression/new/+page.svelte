<script lang="ts">
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import ContractCard from '$lib/contracts/ContractCard.svelte';
	import type { ContractRowFull, InterpreterRowFull } from '$lib/types/types';
	import type { Database } from '$lib/types/generated-db-types';
	import type { ExpressionMetadata } from 'rain-metadata/metadata-types/expression';
	import { Button } from 'rain-svelte-components/package';
	import { ArrowUturnLeft } from '@steeze-ui/heroicons';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import InterpreterTag from '$lib/InterpreterTag.svelte';
	import { createNewExpression } from '$lib/expressions/expressions';
	import { goto } from '$app/navigation';

	let contracts: ContractRowFull[];
	let interpreters: InterpreterRowFull[];

	$: contracts = $page.data.contracts;
	$: interpreters = $page.data.interpreters;

	enum ExpressionSteps {
		Contract,
		Method,
		Interpreter,
		Confirm
	}

	let newExpression: Database['public']['Tables']['draft_expressions']['Insert'];
	let step: ExpressionSteps = ExpressionSteps.Contract;

	let chosenContract: ContractRowFull,
		chosenExpression: ExpressionMetadata,
		chosenInterpreter: InterpreterRowFull;

	let inserting: boolean;

	const chooseContract = (contract: ContractRowFull) => {
		step = ExpressionSteps.Method;
		chosenContract = contract;
	};

	const chooseExpression = (contractExpression: ExpressionMetadata) => {
		step = ExpressionSteps.Interpreter;
		chosenExpression = contractExpression;
	};

	const chooseInterpreter = (interpreter: InterpreterRowFull) => {
		step = ExpressionSteps.Confirm;
		chosenInterpreter = interpreter;
	};

	const confirmCreate = async () => {
		inserting = true;
		const _expression = { contract: chosenContract.id, interpreter: chosenInterpreter.id };
		const newExpression = await createNewExpression(_expression);
		goto(`/expression/draft/${newExpression.data?.sharable_slug}/edit`);
	};
</script>

<Background alignItems="items-start" justifyContent="justify-center">
	<div class="pt-28 flex flex-col items-center max-w-5xl gap-y-6">
		<h1 class="text-4xl font-semibold">Start writing a new expression</h1>
		{#if step == ExpressionSteps.Contract}
			<div in:fade class="step-wrapper">
				<h2>Choose a contract to write for</h2>
				{#if contracts.length}
					<div class="grid grid-cols-3 gap-4">
						{#each contracts as contract}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								on:click={() => {
									chooseContract(contract);
								}}
							>
								<ContractCard {contract} />
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else if step == ExpressionSteps.Method}
			<div in:fade class="step-wrapper">
				<div class="header">
					<h2>Choose an expression to write for</h2>
				</div>
				{#if chosenContract.metadata.expressions}
					<div class="flex flex-col gap-y-4 w-full max-w-4xl">
						{#each chosenContract.metadata.expressions as expression}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								on:click={() => {
									chooseExpression(expression);
								}}
								class="flex flex-col gap-y-2 p-6 rounded-2xl border-gray-200 border w-full hover:scale-105 transition-transform cursor-pointer bg-white"
							>
								<span class="text-xl self-start rounded-lg">
									{expression.name}
								</span>
								<span>
									{expression.description}
								</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else if step == ExpressionSteps.Interpreter}
			<div in:fade class="step-wrapper">
				<div class="header">
					<h2>Choose an interpreter</h2>
				</div>
				<div class="flex flex-col gap-y-4 w-full max-w-4xl">
					{#each interpreters as interpreter}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => {
								chooseInterpreter(interpreter);
							}}
							class="flex flex-col gap-y-2 p-6 rounded-2xl border-gray-200 border w-full hover:scale-105 transition-transform cursor-pointer bg-white"
						>
							<span class="text-xl self-start rounded-lg">
								{interpreter.metadata.name}
							</span>
							<span>Extra info</span>
						</div>
					{/each}
				</div>
			</div>
		{:else if step == ExpressionSteps.Confirm}
			<div in:fade class="step-wrapper">
				<div class="header">
					<h2>Confirm and start writing</h2>
				</div>
				<div class="flex flex-col gap-y-4">
					<span class="text-gray-600 text-xs uppercase">Writing for</span>
					<ProjectTag
						name={chosenContract.project.name}
						logoUrl={chosenContract.project.logo_url}
					/>
					<div class="text-xl flex items-center gap-x-2">
						<span class="font-semibold">{chosenContract.metadata.name}</span>
						<div class="h-8 border-l-2 border-gray-300 -rotate-12" />
						<span>{chosenExpression.name}</span>
					</div>
					<InterpreterTag
						name={chosenInterpreter.metadata.name}
						address="0xf6CF014a3e92f214a3332F0d379aD32bf0Fae929"
					/>
				</div>
				<div class="flex gap-x-2">
					<Button
						disabled={inserting}
						on:click={() => {
							step = ExpressionSteps.Contract;
						}}
						variant="transparent"
						icon={ArrowUturnLeft}>Start over</Button
					>
					<Button disabled={inserting} on:click={confirmCreate} variant="primary">
						{#if !inserting}
							Confirm
						{:else}
							Creating...
						{/if}
					</Button>
				</div>
			</div>
		{/if}
	</div>
</Background>

<style lang="postcss">
	.header {
		@apply w-full flex flex-col items-center gap-y-6;
	}

	h2 {
		@apply text-xl;
	}

	.step-wrapper {
		@apply w-full flex flex-col items-center gap-y-16;
	}
</style>
