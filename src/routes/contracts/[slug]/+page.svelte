<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import Sidebar from './Sidebar.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';
	import { Tabs, TabList, TabPanel, Tab } from 'rain-svelte-components/package/tabs/tabs';
	import KnownAddresses from '$lib/KnownAddresses.svelte';
	import Write from './Write.svelte';
	import Summary from './Summary.svelte';

	$: contract = $page.data.contract;
	$: ({ project, metadata, abi, contract_addresses_new } = contract);
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
				<Tab>Examples</Tab>
				<Tab>Community</Tab>
			</TabList>
		</div>
	</div>
	<div class="justify-stretch container mx-auto flex flex-col gap-y-8 px-4 sm:px-0 lg:flex-row">
		<div class="flex flex-col gap-y-8 py-10 lg:w-2/3 lg:pr-6">
			<TabPanel>
				<Summary {abi} {metadata} contractAddresses={contract_addresses_new} />
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
		</div>
		<div class="py-8 lg:w-1/3"><Sidebar {contract} /></div>
	</div>
</Tabs>
