<script lang="ts">
	import { Section, SectionBody, SectionHeading } from 'rain-svelte-components/package/section';
	import SidebarHeading from '$lib/SidebarHeading.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import { DisplayAddress } from 'rain-svelte-components/package';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { User } from '@steeze-ui/heroicons';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let amountToShow = 5;
	let showMore = false;
	let expressionsToShow: any[] = [];
	let _expressionSG: any[];

	const seeAll = () => {
		if (showMore) amountToShow = 5;
		else amountToShow = _expressionSG.length;

		showMore = !showMore;
		expressionsToShow = _expressionSG?.slice(0, amountToShow);
	};

	onMount(() => {
		_expressionSG = $page.data.expressionSG;
		expressionsToShow = _expressionSG?.slice(0, amountToShow);
	});
</script>

<div class="w-full">
	<Section>
		<SidebarHeading>Recently deployed</SidebarHeading>
		<SectionBody>
			{#each expressionsToShow as { name, config, event, account }}
				<div class="border-b border-slate-200 pb-[10px] flex flex-col gap-y-2.5">
					<div
						class="font-mono text-[12px] leading-4 bg-neutral-100 tracking-[-0.01em] rounded-[5px] max-h-[89px] overflow-hidden gradient-mask-b-70"
					>
						<Formatter
							stateConfig={{
								sources: config.sources,
								constants: config.constants
							}}
						/>
					</div>
					<div class="flex gap-x-3.5 text-neutral-500 text-[13px]">
						<TimeAgo dateString={event.transaction.timestamp * 1000} />
						<div class="flex gap-x-0.5">
							<div class="mt-[3px]">
								<Icon src={User} size="12px" />
							</div>
							<DisplayAddress address={account.id} />
						</div>
					</div>
				</div>
			{/each}
			<div class="self-center text-[13px] leading-[17px] tracking-[-0.01em] text-black">
				<button on:click={seeAll}>{showMore ? 'Hide' : 'See all'}</button>
			</div>
		</SectionBody>
	</Section>
</div>
