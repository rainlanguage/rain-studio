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

	$: expressions = $page.data.expressionSG;
</script>

<div class="flex flex-col">
	<Section>
		<SidebarHeading>Recently deployed</SidebarHeading>
		<SectionBody>
			{#each expressions as expression}
				<div class="border-b border-slate-200 pb-[10px] flex flex-col gap-y-2.5">
					<div class="text-[13px] leading-[17px] tracking-[-0.01em] text-black mb-1">
						{expression.name ?? 'Expression name'}
					</div>
					<div
						class="font-mono text-[12px] leading-[15.62px] bg-neutral-100 rounded-[5px] overflow-hidden"
					>
						<div class="overflow-y-scroll max-h-[100px]">
							<Formatter
								stateConfig={{
									sources: expression.config.sources,
									constants: expression.config.constants
								}}
							/>
						</div>
					</div>
					<div class="flex gap-x-3.5 text-neutral-500 text-[13px]">
						<p>{timeSince(new Date(Date.now() - expression.event.transaction.timestamp))} ago</p>
						<div class="flex gap-x-0.5">
							<div class="mt-[3px]">
								<Icon src={User} size="12px" />
							</div>
							<DisplayAddress address={expression.sender.id} />
						</div>
					</div>
				</div>
			{/each}
		</SectionBody>
	</Section>
</div>
