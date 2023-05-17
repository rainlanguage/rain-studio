<script lang="ts">
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';
	import { Button, InputDropdown, Select } from '@rainprotocol/rain-svelte-components';
	import { getContractDeployTxData, RainNetworks, type DISpair } from 'rain-x-deploy';
	import { chainId, connected, provider, signer } from 'svelte-ethers-store';
	import { getCommonChains, getKnownContractAddressesForChain, getNameFromChainId } from './write';
	import { changeNetwork } from '$lib/connect-wallet';
	import { createClient } from '@urql/core';
	import { Subgraphs } from '$lib/utils';
	import { supabaseClient } from '$lib/supabaseClient';

	export let contractAddresses: ContractAddressRow[], deployerAddresses: DeployerAddressesRow[];

	let selectedDeployer: any;
	let selectedItem: any;
	let items: any;

	let originChain: number;
	let selectedChain: number;
	let oldChain = -1;
	let selectedContractAddress: string;

	let txHash: string;
	let dispair: DISpair;

	const getContractChains = (contractAddresses: ContractAddressRow[]): number[] => {
		// will only include unique chains for the contract
		const chains: Set<number> = new Set();
		contractAddresses.forEach((el) => {
			chains.add(el.chain_id);
		});
		return Array.from(chains.values());
	};

	const changeOriginChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;
		originChain = parseInt(chainIdSelected, 10);
	};

	const changeChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;

		if ($chainId != chainIdSelected) {
			const resp = await changeNetwork(chainIdSelected);
			if (!resp.success) {
				selectedChain = oldChain;
			} else {
				// Reset current contract selected
				oldChain = selectedChain;
			}
		}
	};

	const getContractInfo = async (address_: string) => {
		const client_ = createClient({
			url: Subgraphs[0].url
		});

		const query_ = `
			{
				contract (id: "${address_}") {
					deployTransaction {
						id
					}
				}
			}
		`;
		const { data: dataSg, error: errorSg } = await client_.query(query_, {}).toPromise();

		const { data: dataDb, error: errorDb } = await supabaseClient
			.from('contract_addresses_new')
			.select(
				'deployer:initial_deployer(address, interpreter_address(address), store_address(address))'
			)
			.eq('address', address_)
			.single();

		if (errorSg) {
			console.log('Errow when fetching from SG: ', errorSg.message);
		}

		if (errorDb) {
			console.log('Errow when fetching from DB: ', errorDb.message);
		}

		txHash = dataSg.contract.deployTransaction.id;
		dispair = {
			deployer: dataDb?.deployer.address,
			interpreter: dataDb?.deployer.interpreter_address.address,
			store: dataDb?.deployer.store_address.address
		};
	};

	$: commonChains = getCommonChains(deployerAddresses, contractAddresses);
	$: contractChains = getContractChains(contractAddresses);
	$: knownAddressesForThisChain = getKnownContractAddressesForChain(contractAddresses, originChain);
	$: console.log(contractAddresses);

	$: availableAddresses = knownAddressesForThisChain.length ? true : false;
</script>

<div class="">
	<p>
		txHash: {txHash}
	</p>
	<p>
		dispair: {JSON.stringify(dispair, null, 4)}
	</p>
</div>

{#if !$signer}
	<div class="flex flex-col gap-y-6 self-center">
		<p>You should connect your wallet before interacting with the newtork</p>
		<ConnectWallet />
	</div>
{:else}
	<div class="flex flex-col gap-y-4">
		<span>Select an origin chain:</span>
		<Select
			items={contractChains.map((chainId_) => ({
				label: getNameFromChainId(chainId_),
				value: chainId_
			}))}
			on:change={changeOriginChain}
			bind:value={selectedChain}
		/>

		{#if availableAddresses}
			<Select
				items={knownAddressesForThisChain}
				on:change={() => getContractInfo(selectedContractAddress)}
				bind:value={selectedContractAddress}
			/>
		{/if}

		<Button disabled={!availableAddresses} on:click={getContractInfo}>Deploy</Button>

		{#if !availableAddresses && originChain}
			<span class="text-yellow-600">No known deployments for this chain.</span>
		{/if}

		<div>
			<InputDropdown
				bind:value={selectedDeployer}
				bind:selectedItem
				{items}
				placeholder="Select interpreter"
				classInput="text-neutral-600 border border-neutral-100 bg-white rounded-md px-0 py-1 text-xs w-full pl-2"
				classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md text-xs shadow cursor-default font-mono"
			/>
		</div>
	</div>
{/if}
