<script lang="ts">
	import { page } from '$app/stores';
	import PageHeader from '$lib/PageHeader.svelte';
	import ProjectTag from '$lib/ProjectTag.svelte';
	import { Button } from 'rain-svelte-components/package';
	import AutoAbiFormSeparated from 'rain-svelte-components/package/auto-abi-form/AutoAbiFormSeparated.svelte';
	import Sidebar from './Sidebar.svelte';
	import Pills from 'rain-svelte-components/package/Pills.svelte';
	import { Tabs, TabList, TabPanel, Tab } from 'rain-svelte-components/package/tabs/tabs';
	import KnownAddresses from '$lib/KnownAddresses.svelte';

	import { env } from '$env/dynamic/public';

	$: project = $page.data.contract.project;
	$: metadata = $page.data.contract.metadata;
	$: abi = $page.data.contract.abi;
</script>

{env.PUBLIC_SUPABASE_URL}{env.PUBLIC_SUPABASE_ANON_KEY}

<PageHeader>
	<div class="flex flex-col container mx-auto h-full items-stretch">
		<div class="flex flex-col justify-center justify-self-stretch h-full gap-y-3">
			<ProjectTag logoUrl={project.logo_url} name={project.name} />
			<span class="font-semibold text-2xl">{metadata.name}</span>
			<div class="flex gap-x-2 items-center">
				<Pills><span class="text-sm">{metadata.type}</span></Pills>
				<span class="text-gray-500"><KnownAddresses {metadata} /></span>
			</div>
		</div>
	</div>
</PageHeader>
<Tabs>
	<div class="bg-gray-100 w-full">
		<div class="container mx-auto ">
			<TabList>
				<Tab>Contract</Tab>
				<Tab>Write</Tab>
				<Tab>Examples</Tab>
				<Tab>Community</Tab>
			</TabList>
		</div>
	</div>
	<div class="container flex mx-auto justify-stretch">
		<div class="w-2/3 flex flex-col pt-10 gap-y-8 pr-6">
			<TabPanel>
				<div class="flex flex-col gap-y-3 max-w-prose">
					<span class="text-2xl">{metadata.name}</span>
					<span>{metadata.description}</span>
				</div>
				<AutoAbiFormSeparated abi={abi.abi} {metadata} />
				<div class="self-start">
					<Button variant="primary">Deploy {metadata.name}</Button>
				</div>
			</TabPanel>
		</div>
		<div class="border-l border-gray-200 w-1/3"><Sidebar /></div>
	</div>
</Tabs>
