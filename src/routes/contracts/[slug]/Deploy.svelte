<script lang="ts">
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';
	import { Button, InputDropdown, Select } from '@rainprotocol/rain-svelte-components';
	import { getContractDeployTxData, RainNetworks, type DISpair } from 'rain-x-deploy';
	import { chainId, connected, provider, signer } from 'svelte-ethers-store';
	import { getCommonChains, getKnownContractAddressesForChain, getNameFromChainId } from './write';
	import { changeNetwork } from '$lib/connect-wallet';
	import { createClient } from '@urql/core';
	import { Subgraphs, networkOptions } from '$lib/utils';
	import { supabaseClient } from '$lib/supabaseClient';
	import type { Item } from '@rainprotocol/rain-svelte-components/dist/input-dropdown/InputDropdown.svelte';

	export let contractAddresses: ContractAddressRow[], deployerAddresses: DeployerAddressesRow[];

	let originChain: number;
	let selectedContractAddress: string;
	let selectedContractItem: Item;
	let txHash: string;
	let dispairOrigin: DISpair;

	// Selected chain (provider to deploy)
	let targetChain: number;
	let oldChain = -1;
	let selectedDeployerAddress: any;
	let selectedDeployerItem: Item;
	let dispairTarget: DISpair;

	$: subgraphInfoOrigin = Subgraphs.find((sg_) => sg_.chain == originChain);
	$: subgraphInfoTarget = Subgraphs.find((sg_) => sg_.chain == targetChain);

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
	};

	const changeTargetChain = async (event_: Event) => {
		const chainIdSelected = (event_.target as HTMLSelectElement).value;

		if ($chainId != chainIdSelected) {
			const resp = await changeNetwork(chainIdSelected);
			if (!resp.success) {
				targetChain = oldChain;
			} else {
				// Reset current target selected
				selectedDeployerAddress = null;
				selectedDeployerItem = { label: null, value: null };
				oldChain = targetChain;
			}
		}
	};

	const getContractInfo = async (address_: string) => {
		if (!address_ || !originChain || originChain == -1) return;

		const sgUrl = Subgraphs.find((sg_) => sg_.chain == originChain)?.url;

		if (!sgUrl) {
			// errorContractOrigin = 'There is no SG url available for that network yet';
			console.log(`There is no SG url available for that network yet: ${originChain}`);
			return;
		}

		const client_ = createClient({
			url: sgUrl
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

		if (errorSg || !dataSg.contract) {
			if (errorSg) {
				throw new Error(`Errow when fetching from SG: ${errorSg.message}`);
			} else {
				throw new Error(`Invalid or not tracked address: ${address_}`);
			}
		}

		if (errorDb) {
			throw new Error(`Errow when fetching from DB: ${errorDb.message}`);
		}

		txHash = dataSg.contract.deployTransaction.id;
		dispairOrigin = {
			deployer: dataDb?.deployer.address,
			interpreter: dataDb?.deployer.interpreter_address.address,
			store: dataDb?.deployer.store_address.address
		};
	};

	const filterDeployers = (chain_: number): Item[] => {
		const deployers_ = deployerAddresses.filter((address) => chain_ == address.chainId);

		return deployers_.map((deployer_) => {
			return {
				label: deployer_.address,
				value: deployer_.address
			};
		});
	};

	const getDeployerInfo = async (address_: string, chainId_: number) => {
		if (!address_ || !chainId_ || chainId_ == -1) return;

		const sgUrl = subgraphInfoTarget?.url;

		if (!sgUrl) {
			console.log(`There is no SG url available for that network yet: ${chainId_}`);
			return;
		}

		const { data: dataDb, error: errorDb } = await supabaseClient
			.from('deployers_addresses')
			.select('address, interpreter_address(address), store_address(address)')
			.eq('address', address_)
			.eq('chainId', chainId_)
			.single();

		if (errorDb) {
			console.log(`Error when fetching from DB: ${errorDb.message}`);
			return;
		}
		if (!dataDb) {
			throw new Error(`Not data found for this address "${address_}" and chainId "${chainId_}"`);
		}

		dispairTarget = {
			deployer: dataDb.address,
			interpreter: dataDb.interpreter_address?.address,
			store: dataDb.store_address?.address
		};
	};

	const crossDeploy = async () => {
		let network: RainNetworks | null = null;
		if (originChain == 1) network = RainNetworks.Ethereum;
		if (originChain == 137) network = RainNetworks.Polygon;
		if (originChain == 80001) network = RainNetworks.Mumbai;

		if (network == null) {
			throw new Error('Not network valid to get data');
		}
		const fromDIS = dispairOrigin;
		const toDIS = originChain == targetChain ? dispairOrigin : dispairTarget;
		const txData = await getContractDeployTxData(network, fromDIS, toDIS, selectedContractAddress);

		await $signer.sendTransaction({ data: txData });
	};

	// $: commonChains = getCommonChains(deployerAddresses, contractAddresses);
	$: contractChains = getContractChains(contractAddresses);
	$: knownAddressesForThisChain = getKnownContractAddressesForChain(contractAddresses, originChain);
	$: availableAddresses = knownAddressesForThisChain.length ? true : false;

	$: selectedContractAddress, getContractInfo(selectedContractAddress);
	$: selectedDeployerAddress, targetChain, getDeployerInfo(selectedDeployerAddress, targetChain);
</script>

<!-- TODO: Add styling and modal when waiting for the deployment transaction and show the results -->

{#if !$signer}
	<div class="flex flex-col gap-y-6 self-center">
		<p>You should connect your wallet before interacting with the newtork</p>
		<ConnectWallet />
	</div>
{:else}
	<div class="flex flex-col gap-y-4">
		<div>
			<span>Select an origin chain:</span>
			<Select
				items={contractChains.map((chainId_) => ({
					label: getNameFromChainId(chainId_),
					value: chainId_
				}))}
				on:change={changeOriginChain}
				bind:value={originChain}
			/>
		</div>

		{#if availableAddresses}
			<div>
				<span>Select a contract address:</span>
				<InputDropdown
					disabled={originChain == -1}
					bind:value={selectedContractAddress}
					bind:selectedItem={selectedContractItem}
					items={knownAddressesForThisChain}
					placeholder="Select or paste an address"
					classInput="bg-neutral-100 text-neutral-600 border border-neutral-100 bg-white rounded-md py-1 pl-2 disabled:cursor-not-allowed"
					classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md shadow cursor-default"
				/>
			</div>
		{/if}

		{#if selectedContractAddress && selectedContractAddress != ''}
			<div>
				<span>Select a target chain:</span>
				<Select items={networkOptions} on:change={changeTargetChain} bind:value={targetChain} />
			</div>
			{#if targetChain && targetChain != -1 && originChain != targetChain}
				<div>
					<span>Specify a deployer address on target network:</span>
					{#key targetChain}
						<InputDropdown
							disabled={targetChain == -1}
							bind:value={selectedDeployerAddress}
							bind:selectedItem={selectedDeployerItem}
							items={filterDeployers(targetChain)}
							placeholder="Select a deployer address"
							classInput="bg-neutral-100 text-neutral-600 border border-neutral-100 bg-white rounded-md py-1 pl-2 disabled:cursor-not-allowed"
							classContainer="max-h-28 text-neutral-600 border-[1px] border-gray-400 bg-white rounded-md shadow cursor-default"
						/>
					{/key}
					{#if !subgraphInfoTarget}
						<span class="text-yellow-600">'There is no SG url available for that network yet</span>
					{/if}
				</div>
			{/if}
		{/if}

		<Button
			disabled={!targetChain || targetChain == -1 || !subgraphInfoTarget}
			on:click={crossDeploy}>Deploy</Button
		>
	</div>
{/if}
