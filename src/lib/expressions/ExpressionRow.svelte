<script lang="ts">
	import ExpressionEnv from '$lib/expressions/ExpressionEnv.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import ViewTags from '$lib/ViewTags.svelte';
	import { DisplayAddress, HoverTooltip } from 'rain-svelte-components/package';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';

	import { LockOpen, LockClosed } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let expression: any;
</script>

<div class="flex flex-col xl:flex-row border border-gray-200 p-5 rounded-lg gap-x-4 gap-y-4 w-full">
	<div class="w-1/3 flex flex-col gap-y-3">
		<div class="flex gap-x-1.5">
			<div class="text-xl">
				{#if expression?.name}
					<span class="font-medium">{expression?.name || 'Untitled'}</span>
				{:else if expression?.sg?.id}
					<span><DisplayAddress address={expression.sg.id} /></span>
				{/if}
			</div>
			<div class="w-4">
				<HoverTooltip
					placeHolder={`This expression is ${expression.public ? 'public' : 'private'}`}
				>
					<Icon src={expression.public ? LockOpen : LockClosed} />
				</HoverTooltip>
			</div>
		</div>

		<TimeAgo dateString={expression.created_at} />
		{#if expression?.tags}
			<ViewTags tags={expression.tags} />
		{/if}
		<span>{expression?.notes || 'No notes'}</span>
		<ExpressionEnv {expression} />
		<slot />
	</div>
	<div class="flex-grow h-full w-2/3">
		{#if expression.raw_expression}
			<Formatter raw={expression.raw_expression} />
		{/if}
		{#if expression.stateConfig}
			<Formatter stateConfig={expression.stateConfig} />
		{/if}
	</div>
</div>
