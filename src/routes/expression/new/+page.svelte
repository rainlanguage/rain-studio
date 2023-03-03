<script lang="ts">
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import Background from '$lib/Background.svelte';
	import ContractCard from '$lib/contracts/ContractCard.svelte';
	import type { ContractRowFull, InterpreterRowFull } from '$lib/types/types';
	import type { Database } from '$lib/types/generated-db-types';
	import { Button } from 'rain-svelte-components/package';
	import { ArrowUturnLeft, PlusCircle } from '@steeze-ui/heroicons';
	import { createNewExpression } from '$lib/expressions/expressions';
	import { goto } from '$app/navigation';
	import { Icon } from '@steeze-ui/svelte-icon';
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';

	let contracts: ContractRowFull[];
	let interpreters: InterpreterRowFull[];

	$: contracts = $page.data.contracts;
	$: interpreters = $page.data.interpreters;

	enum ExpressionSteps {
		Contract,
		Expression,
		Interpreter,
		Confirm
	}

	let newExpression: Database['public']['Tables']['draft_expressions_w']['Insert'];
	let step: ExpressionSteps = ExpressionSteps.Contract;

	let chosenContract: ContractRowFull | null,
		chosenExpression: unknown,
		chosenInterpreter: InterpreterRowFull;

	let inserting: boolean;

	const chooseContract = (contract: ContractRowFull | null) => {
		if (contract) {
			step = ExpressionSteps.Expression;
		} else {
			step = ExpressionSteps.Interpreter;
		}
		chosenContract = contract;
	};

	const chooseExpression = (contractExpression: unknown) => {
		step = ExpressionSteps.Interpreter;
		chosenExpression = contractExpression;
	};

	const chooseInterpreter = (interpreter: InterpreterRowFull) => {
		step = ExpressionSteps.Confirm;
		chosenInterpreter = interpreter;
	};

	const confirmCreate = async () => {
		inserting = true;
		const _expression = {
			contract: chosenContract?.id,
			interpreter: chosenInterpreter.id,
			contract_expression: chosenExpression?.name
		};
		const newExpression = await createNewExpression(_expression);
		goto(`/expression/draft/${newExpression.data?.sharable_slug}/edit`);
	};
</script>

<Background alignItems="items-start" justifyContent="justify-center">
	<div class="container mx-auto flex flex-col items-center gap-y-6 px-4 pt-8 sm:px-0 md:pt-20">
		<h1 class="text-center text-2xl font-semibold sm:text-4xl">Start writing a new expression</h1>
		{#if step == ExpressionSteps.Contract}
			<div in:fade class="step-wrapper">
				<h2 class="text-center">Choose a contract to write for</h2>
				{#if contracts.length}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => chooseContract(null)}
							class="flex w-full cursor-pointer flex-col gap-y-2 rounded-2xl border border-gray-200 bg-white p-4 transition-transform hover:scale-105"
						>
							<span class="w-7 text-gray-400">
								<Icon src={PlusCircle} />
							</span>
							<span class="font-semibold">No contract</span>
							<span>Write a standlone expression</span>
						</div>
						{#each contracts as contract}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								on:click={() => {
									chooseContract(contract);
								}}
							>
								<ContractCard contractF={contract} />
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else if step == ExpressionSteps.Expression}
			<div in:fade class="step-wrapper">
				<div class="header">
					<h2>Choose an expression to write for</h2>
				</div>
				{#if chosenContract && chosenContract?.metadata.expressions}
					<div class="flex w-full max-w-4xl flex-col gap-y-4">
						{#each chosenContract.metadata.expressions as expression}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								on:click={() => {
									chooseExpression(expression);
								}}
								class="flex w-full cursor-pointer flex-col gap-y-2 rounded-2xl border border-gray-200 bg-white p-6 transition-transform hover:scale-105"
							>
								<span class="self-start rounded-lg text-xl">
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
				<div class="flex w-full max-w-4xl flex-col gap-y-4">
					{#each interpreters as interpreter}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => {
								chooseInterpreter(interpreter);
							}}
							class="flex w-full cursor-pointer flex-col gap-y-2 rounded-2xl border border-gray-200 bg-white p-6 transition-transform hover:scale-105"
						>
							<span class="self-start rounded-lg text-xl">
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
					<span class="text-xs uppercase text-gray-600">Writing for</span>
					<ExpressionEnv
						expression={{
							contract: chosenContract,
							interpreter: chosenInterpreter,
							contract_expression: chosenExpression?.name
						}}
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
		@apply flex w-full flex-col items-center gap-y-6;
	}

	h2 {
		@apply text-xl;
	}

	.step-wrapper {
		@apply flex w-full flex-col items-center gap-y-16;
	}
</style>
