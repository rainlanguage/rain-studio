<script lang="ts">
	import { AcademicCap, PaperAirplane } from '@steeze-ui/heroicons';
	import { Button } from 'rain-svelte-components/package';

	const openDocs = () => {
		window.open('/docs', '_blank')?.focus();
	};

	const openTg = () => {
		window.open('https://t.me/+W0aQ36ptN_E2MjZk', '_blank')?.focus();
	};
</script>

<div class="flex w-[350px] flex-col divide-y">
	<div class="divide-gap items-left flex flex-col gap-y-2">
		<span class="text-lg font-medium leading-none">Documentation</span>
		<span>Learn how to write and deploy expressions.</span>
		<Button on:click={openDocs} size="small" icon={AcademicCap} classes="self-start"
			>Read the docs</Button
		>
	</div>
	<div class="divide-gap flex flex-col gap-y-2">
		<span class="text-lg font-medium leading-none">Community</span>
		<span>Get help from the Rain team and others in the community.</span>
		<Button on:click={openTg} size="small" icon={PaperAirplane} classes="self-start"
			>Join the Telegram group</Button
		>
	</div>
</div>

<style lang="postcss">
	.divide-gap {
		@apply py-6 first:pt-0 last:pb-0;
	}
</style>
