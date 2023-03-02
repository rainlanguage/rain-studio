<script lang="ts">
	import { page } from '$app/stores';
	import { getContractInfo } from '$lib/abis';
	import PageHeader from '$lib/PageHeader.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { logoUrlRain, nameRain } from '$lib/utils/constants';
	import { Tab, TabList, TabPanel, Tabs } from 'rain-svelte-components/package/tabs/tabs';
	import Sidebar from './Sidebar.svelte';
	import Summary from './Summary.svelte';
	import Write from './Write.svelte';

	$: contractRowFull = $page.data.contractRowFull;
	$: slugData = $page.data.slugData;
	$: meta = $page.data.meta;
	$: knownContracts = $page.data.knownContracts;

	$: project = contractRowFull?.project;

	$: description = meta.desc;
	$: knownAddresses = slugData.knownAddresses;
	$: chainId = $page.data.chainId;

	$: contractF = getContractInfo($page.params.slug);

	$: addressCount = slugData?.knownAddresses.length;
	$: metadata = $page.data.metadata;
</script>

<PageHeader>
	<div class="container mx-auto flex h-full flex-col items-stretch px-4 sm:px-0">
		<div class="flex h-full flex-col justify-center gap-y-3 justify-self-stretch">
			<ProjectTag logoUrl={project?.logo_url ?? logoUrlRain} name={project?.name ?? nameRain} />
			<span class="text-2xl font-semibold">{slugData.name}</span>
			<div class="flex items-center gap-x-2">
				<span class="text-sm text-gray-600">
					{addressCount} known address{#if addressCount > 1}es{/if} on 1 chain
				</span>
			</div>
		</div>
	</div>
</PageHeader>
{#if contractF}
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
					<Summary {description} {knownAddresses} {chainId} />
				</TabPanel>
				<TabPanel>
					<Write abi={contractF.abi} {knownContracts} {metadata} />
				</TabPanel>
			</div>
			<div class="py-8 lg:w-1/3"><Sidebar contract={contractRowFull} /></div>
		</div>
	</Tabs>
{/if}
