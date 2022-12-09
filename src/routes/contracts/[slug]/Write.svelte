<script lang="ts">
	import { page } from '$app/stores';
	import { Button, Select, Modal } from 'rain-svelte-components/package';
	import AutoAbiFormSeparated from 'rain-svelte-components/package/auto-abi-form/AutoAbiFormSeparated.svelte';
	import type { ContractMetadata } from 'rain-metadata/metadata-types/contract';
	import { ethers } from 'ethers';
	import { chainId, defaultEvmStores, contracts, signer, allChainsData } from 'svelte-ethers-store';
	import SaveExpression, { type PresaveExpression } from '$lib/expressions/SaveExpression.svelte';
	import Auth from '$lib/Auth.svelte';
	import LoadExpressionModal from '$lib/expressions/LoadExpressionModal.svelte';
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { fade } from 'svelte/transition';
	import { get, set } from 'lodash-es';
	import type { Abi, AbiFunction } from 'abitype';
	import {
		getCommonChains,
		getInterpretersForChain,
		getKnownContractAddressesForChain,
		getNameFromChainId,
		getWriteMethods
	} from './write';

	export let metadata: ContractMetadata, abi: { abi: Abi }, contract: any;

	let result: any = []; // the state of the the form

	let selectedMethod: { name: string; def: AbiFunction } | -1; // the selected method
	let selectedChain: number;
	let selectedInterpreter: { id: string; interpreter: string; deployer: string } | -1;
	let selectedContract: string | -1; // the selected contract address

	let openNewExpModal: boolean = false,
		loadExpressionModal: boolean = false;
	let expressionToSave: string;
	let presaveExpression: PresaveExpression;

	let loadRaw: Function;

	$: availableChains = getCommonChains($page.data.interpreters, metadata);
	$: writeMethods = getWriteMethods(abi.abi);

	/**
	 * Function for converting an abi path to a path that can be used to set the path
	 * in the object required for the ABI method args array.
	 *
	 * Returns null if the `path` is not a child of `methodName` in the `abi`.
	 *
	 * @param path - the full path in the abi (including the method), e.g. '[5].inputs[0].components[3].components[0]'
	 * @param abi - the abi
	 * @param methodName - the method name the path should be a child of
	 */
	const constructPath = (path: string | undefined, abi: Abi, methodName: string) => {
		// return if no path
		if (!path) return;

		const splitPath = path.split('.');

		// get the path for the method (the array index of the method is always first in the path)
		const methodPath = splitPath.shift();
		// return if no method path can be extracted
		if (!methodPath) return;

		// get the part of the abi for the method
		const method = get(abi, methodPath);

		// ensure this part of the abi is function and the the methodName matches
		if (!(method.type == 'function' && method.name == methodName)) return;

		// using reduce to create the fully named path we can use to set a value in the final method args array
		const namedPath = splitPath.reduce(
			(acc, curr) => {
				const o = get(acc[0], curr);
				const namedPathSegment: string = curr.includes('input') ? '[' + curr.split('[')[1] : o.name;
				const accumulatedNamedPath = acc[1] ? acc[1] + '.' + namedPathSegment : namedPathSegment;
				return [o, accumulatedNamedPath];
			},
			[get(abi, methodPath), null]
		);
		return namedPath[1];
	};

	// submit the transaction
	const submit = async () => {
		// creating an ethers contract instance with the selected known address
		if (typeof selectedContract == 'string' && ethers.utils.isAddress(selectedContract))
			defaultEvmStores.attachContract(
				'selectedContract',
				selectedContract,
				abi.abi as unknown as string
			);

		// handling error cases
		if (selectedInterpreter == -1) throw Error('No interpreter selected');
		if (selectedMethod == -1) throw Error('No method selected');
		if (!metadata.interpreterFields)
			throw Error('Interpreter and deploy fields not defined in metadata');

		// we need to fill out the interpreter/deployer fields for the user based on what they selected

		// get the path of the deployer field in the result
		const deployerPath = constructPath(
			metadata.interpreterFields?.deployerFieldPath,
			abi.abi,
			selectedMethod.name
		);
		// set it
		if (deployerPath) set(result, deployerPath, selectedInterpreter.deployer);

		// get the path of the deployer field in the result
		const interpreterPath = constructPath(
			metadata.interpreterFields?.interpreterFieldPath,
			abi.abi,
			selectedMethod.name
		);
		// set it
		if (interpreterPath) set(result, interpreterPath, selectedInterpreter.interpreter);
		console.log(result);
		await $contracts.selectedContract[selectedMethod.name](...result);
	};

	const saveExpression = async ({ detail: { raw } }: { detail: { raw: string } }) => {
		if (selectedInterpreter == -1) throw Error('No interpreter selected');
		presaveExpression = {
			raw_expression: raw,
			contract,
			interpreter: selectedInterpreter?.id
		};
		expressionToSave = raw;
		openNewExpModal = true;
	};

	const loadExpression = async ({ detail }: { detail: any }) => {
		loadRaw = detail.loadRaw;
		loadExpressionModal = true;
	};

	const loadSelectedExpression = async ({ detail }: { detail: any }) => {
		loadExpressionModal = false;
		loadRaw(detail.expression.raw_expression);
	};

	$: connectedChainName = allChainsData.find((chain) => chain.chainId == $chainId)?.name;
</script>

<div class="flex flex-col gap-y-4">
	<span>Select a chain</span>
	<Select
		items={availableChains.map((chainId) => ({
			label: getNameFromChainId(chainId),
			value: chainId
		}))}
		bind:value={selectedChain}
	/>
	{#if selectedChain && selectedChain !== -1}
		<span>Select an interpreter</span>
		<Select
			items={getInterpretersForChain($page.data.interpreters, selectedChain)}
			bind:value={selectedInterpreter}
		/>
	{/if}
	{#if selectedInterpreter && selectedInterpreter !== -1}
		<span>Select a method to write</span>
		<Select items={writeMethods} bind:value={selectedMethod} />
	{/if}
</div>
{#key selectedMethod}
	{#if selectedMethod && selectedMethod !== -1}
		<div in:fade class="mb-12">
			{#key selectedMethod}
				<AutoAbiFormSeparated
					abi={abi.abi}
					{metadata}
					methodName={selectedMethod.name}
					bind:result
					on:save={saveExpression}
					on:load={loadExpression}
					showInterpreterFields={false}
				/>
			{/key}
			<div class="flex flex-col gap-y-4 p-4 border-gray-300 rounded-lg border mt-8">
				{#if !$signer}
					<div class="self-center">
						<ConnectWallet />
					</div>
				{:else}
					<div class="flex gap-x-2 items-center">
						<div class="w-3 h-3 rounded-full bg-green-600" />
						<span>Connected to {connectedChainName}</span>
					</div>
					<div class="flex flex-col gap-y-2">
						{#if getKnownContractAddressesForChain(metadata, selectedChain)?.length}
							<span
								>Select from known addresses for this contract on {allChainsData.find(
									(chain) => chain.chainId == $chainId
								)?.name}</span
							>
							<Select
								items={getKnownContractAddressesForChain(metadata, selectedChain)}
								bind:value={selectedContract}
							/>
						{:else}
							<span class="text-gray-500">No known deployments for this chain.</span>
						{/if}
					</div>
					<div class="self-start">
						<Button disabled={selectedContract == -1} on:click={submit} variant="primary"
							>Submit</Button
						>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/key}

<Modal bind:open={openNewExpModal}>
	{#if $page.data.session}
		<SaveExpression {presaveExpression} />
	{:else}
		<Auth />
	{/if}
</Modal>

<Modal bind:open={loadExpressionModal}>
	{#if $page.data.session}
		<LoadExpressionModal on:select={loadSelectedExpression} />
	{:else}
		<Auth />
	{/if}
</Modal>
