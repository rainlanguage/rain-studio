<script lang="ts">
	import type { InterpreterRowFull } from '$lib/types/types';
	import { CodeBracketSquare } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let interpreter: InterpreterRowFull;
	console.log(interpreter);
</script>

<div class="flex gap-x-1 items-center">
	<div class="w-5 text-gray-700">
		<Icon src={CodeBracketSquare} />
	</div>
	<span class="text-sm text-gray-700">{interpreter.metadata.name}</span>
	<div class="text-xs font-mono text-gray-400">
		{interpreter.metadata.commit}
	</div>
</div>
