<script lang="ts">
	import type { InterpreterRowFull } from '$lib/types/types';
	import { CodeBracketSquare } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let interpreter: InterpreterRowFull;
</script>

<div class="flex items-center gap-x-1">
	<div class="w-5 text-gray-700">
		<Icon src={CodeBracketSquare} />
	</div>
	<span class="text-sm text-gray-700">{interpreter.metadata.name}</span>
	<div class="font-mono text-xs text-gray-400">
		{interpreter.metadata.commit}
	</div>
</div>
