<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import Sidebar from './Sidebar.svelte';
	import { Pills } from '@rainprotocol/rain-svelte-components';
	import { Tabs, TabList, TabPanel, Tab } from '@rainprotocol/rain-svelte-components';
	import KnownAddresses from '$lib/KnownAddresses.svelte';
	import Write from './Write.svelte';
	import Deploy from './Deploy.svelte';
	import DeployProxy from './DeployProxy.svelte';
	import SummaryContract from '$lib/contracts/SummaryContract.svelte';

	$: contract = $page.data.contract;
	$: ({ project, metadata, contract_meta, abi, contract_addresses_new } = contract);

	// Since the CloneFactories are obtained based on the Clonable Version of the
	// contract, we can assume that if the array is empty, then there is no
	// way to clone the contract.
	$: hasCloneFactories = $page.data.cloneFactories.length > 0;
</script>

<PageHeader>
	<div class="container mx-auto flex h-full flex-col items-stretch px-4 sm:px-0">
		<div class="flex h-full flex-col justify-center gap-y-3 justify-self-stretch">
			<!-- <ProjectTag logoUrl={project.logo_url} name={project.name} /> -->
			<span class="text-2xl font-semibold">{metadata.name}</span>
			<div class="flex items-center gap-x-2">
				<!-- <Pills><span class="text-sm">{metadata.type}</span></Pills> -->
				<span class="text-gray-500">
					<KnownAddresses contract_addresses={contract_addresses_new} />
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
				<Tab>Write</Tab>
				<Tab>Deploy</Tab>
				{#if hasCloneFactories}
					<Tab>Proxies</Tab>
				{/if}
				<!-- TODO: FIX -->
				<!-- <Tab>Examples</Tab>
				<Tab>Community</Tab> -->
			</TabList>
		</div>
	</div>
	<div class="justify-stretch container mx-auto flex flex-col gap-y-8 px-4 sm:px-0 lg:flex-row">
		<div class="flex flex-col gap-y-8 py-10 lg:w-2/3 lg:pr-6">
			<TabPanel>
				<SummaryContract {metadata} contractAddresses={contract_addresses_new} />
			</TabPanel>
			<TabPanel>
				<Write
					{abi}
					{metadata}
					{contract}
					contractAddresses={contract_addresses_new}
					deployerAddresses={$page.data.deployers}
				/>
			</TabPanel>
			<TabPanel>
				<Deploy
					contractAddresses={contract_addresses_new}
					deployerAddresses={$page.data.deployers}
					{metadata}
				/>
			</TabPanel>
			{#if hasCloneFactories}
				<TabPanel>
					<DeployProxy
						{abi}
						{contract_meta}
						contractAddresses={contract_addresses_new}
						deployerAddresses={$page.data.deployers}
						cloneFactories={$page.data.cloneFactories}
					/>
				</TabPanel>
			{/if}
		</div>
		<!-- <div class="py-8 lg:w-1/3"><Sidebar {contract} /></div> -->
	</div>
</Tabs>
