<script lang="ts">
	import { CodeBracketSquare } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { DisplayAddress } from 'rain-svelte-components/package';

	export let name: string, address: string;
</script>

<div class="flex gap-x-1 items-center">
	<div class="w-5 text-gray-700">
		<Icon src={CodeBracketSquare} />
	</div>
	<span class="text-sm text-gray-700">{name}</span>
	<div class="text-xs font-mono text-gray-400">
		<DisplayAddress {address} />
	</div>
</div>
