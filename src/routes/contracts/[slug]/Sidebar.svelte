<script lang="ts">
	import { Section, SectionBody, SectionHeading } from 'rain-svelte-components/package/section';
	import SidebarHeading from '$lib/SidebarHeading.svelte';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import { DisplayAddress } from 'rain-svelte-components/package';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { User } from '@steeze-ui/heroicons';

	import { timeSince } from '$lib/utils';

	import { Formatter as rainLangFormatter, rainterpreterOpMeta } from '@beehiveinnovation/rainlang';
	import type { StateConfig } from '@beehiveinnovation/rainlang';
	import { page } from '$app/stores';

	let expressionToShow = 5;
	let expressions: any[];
	let showMore = false;

	const seeAll = () => {
		if (showMore) expressionToShow = 5;
		else expressionToShow = expressionSG.length;

		showMore = !showMore;
	};

	$: expressionSG = $page.data.expressionSG;

	$: if (expressionSG) {
		expressions = expressionSG?.slice(0, expressionToShow);
	}
</script>

<div class="flex flex-col">
	<Section>
		<SidebarHeading>Recently deployed</SidebarHeading>
		<SectionBody>
			{#each expressions as { name, config, event, sender }}
				<div class="border-b border-slate-200 pb-[10px] flex flex-col gap-y-2.5">
					<div class="text-[13px] leading-[17px] tracking-[-0.01em] text-black mb-1">
						{name ?? 'Expression name'}
					</div>
					<div
						class="font-mono text-[12px] leading-[15.62px] bg-neutral-100 rounded-[5px] overflow-hidden"
					>
						<div class="overflow-y-scroll max-h-[100px]">
							<Formatter
								stateConfig={{
									sources: config.sources,
									constants: config.constants
								}}
							/>
						</div>
					</div>
					<div class="flex gap-x-3.5 text-neutral-500 text-[13px]">
						<p>{timeSince(new Date(Date.now() - event.transaction.timestamp))} ago</p>
						<div class="flex gap-x-0.5">
							<div class="mt-[3px]">
								<Icon src={User} size="12px" />
							</div>
							<DisplayAddress address={sender.id} />
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
