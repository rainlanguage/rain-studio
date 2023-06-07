<script lang="ts">
	import { page } from '$app/stores';
	import KnownAddresses from '$lib/KnownAddresses.svelte';
	import PageHeader from '$lib/PageHeader.svelte';

	import SummaryContract from '$lib/contracts/SummaryContract.svelte';
	import DeployInterpreter from '$lib/interpreters/DeployInterpreter.svelte';
	import {
		Button,
		Section,
		SectionBody,
		SectionHeading,
		Tab,
		TabList,
		TabPanel,
		Tabs
	} from '@rainprotocol/rain-svelte-components';
	import { allChainsData } from 'svelte-ethers-store';
	//
	//
	//
	//
	//
	const interpreter = $page.data.interpreter;
	const interpreterAddresses = $page.data.interpreter.addresses;
	const interpreterType = $page.params.type;

	const interpreterName = () => {
		// Only deployer, rainterpreter and stores should be possible since
		// the app redirect or throw an error when the `[type]` is not one of those.
		if (interpreterType === 'deployer') {
			return 'Expression Deployer';
		} else {
			return interpreterType.charAt(0).toUpperCase() + interpreterType.slice(1);
		}
	};
</script>

<div class="mt-2 self-center">
	<Button
		on:click={() => {
			console.log($page);
			console.log(interpreter);
			console.log(interpreterType);
		}}>Click here</Button
	>
</div>
<PageHeader>
	<div class="container mx-auto flex h-full flex-col items-stretch px-4 sm:px-0">
		<div class="flex h-full flex-col justify-center gap-y-3 justify-self-stretch">
			<span class="text-2xl font-semibold">{interpreterName()}</span>
			<div class="flex items-center gap-x-2">
				<span class="text-gray-500">
					<KnownAddresses contract_addresses={interpreterAddresses} />
				</span>
			</div>
		</div>
	</div>
</PageHeader>
<Tabs>
	<div class="w-full bg-gray-100">
		<div class="container mx-auto px-4 sm:px-0 ">
			<TabList>
				<Tab>Contract</Tab>
				<Tab>Deploy</Tab>
			</TabList>
		</div>
	</div>
	<div class="justify-stretch container mx-auto flex flex-col gap-y-8 px-4 sm:px-0 lg:flex-row">
		<div class="flex flex-col gap-y-8 py-10 lg:w-2/3 lg:pr-6">
			<TabPanel>
				<SummaryContract contractAddresses={interpreterAddresses} />
			</TabPanel>
			<TabPanel
				><DeployInterpreter {interpreterType} contractAddresses={interpreterAddresses} /></TabPanel
			>
		</div>
	</div>
</Tabs>
