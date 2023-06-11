<script lang="ts">
	import { page } from '$app/stores';
	import KnownAddresses from '$lib/KnownAddresses.svelte';
	import PageHeader from '$lib/PageHeader.svelte';

	import SummaryContract from '$lib/contracts/SummaryContract.svelte';
	import { interpreterName } from '$lib/interpreters';
	import DeployInterpreter from '$lib/interpreters/DeployInterpreter.svelte';
	import { Tab, TabList, TabPanel, Tabs } from '@rainprotocol/rain-svelte-components';

	const interpreter = $page.data.interpreter;
	const interpreterAddresses = $page.data.interpreter.addresses;
	const interpreterType = $page.params.type;
</script>

<PageHeader>
	<div class="container mx-auto flex h-full flex-col items-stretch px-4 sm:px-0">
		<div class="flex h-full flex-col justify-center gap-y-3 justify-self-stretch">
			<span class="text-2xl font-semibold">{interpreterName(interpreterType)}</span>
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
			<TabPanel>
				<DeployInterpreter {interpreterType} {interpreterAddresses} />
			</TabPanel>
		</div>
	</div>
</Tabs>
