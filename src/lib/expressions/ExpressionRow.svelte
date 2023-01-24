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

<div class="flex w-full flex-col gap-x-4 gap-y-4 rounded-lg border border-gray-200 p-5 xl:flex-row">
	<div class="flex w-full flex-col gap-y-3 xl:w-1/3">
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
	<div class="h-full w-full flex-grow xl:w-2/3">
		{#if expression.raw_expression}
			<Formatter raw={expression.raw_expression} showFork={false} />
		{/if}
		{#if expression.stateConfig}
			<Formatter stateConfig={expression.stateConfig} showFork={false} />
		{/if}
	</div>
</div>
