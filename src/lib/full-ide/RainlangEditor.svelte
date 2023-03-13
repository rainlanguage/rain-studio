<script lang="ts">
	import type { StateConfig } from 'rain-metadata/type-definitions/expression';
	import CodeMirror from 'svelte-codemirror-editor';
	import type { Writable } from 'svelte/store';
	import { Parser } from 'rainlang';

	const emptySc: StateConfig = { sources: [], constants: [] };

	export let raw = '';
	export let vmStateConfig = writable(emptySc);

	let parseTree;
	let expressionConfig;
	[parseTree, expressionConfig] = Parser.get(raw, opMeta, callback);
</script>

<CodeMirror bind:value={raw} lang={null} />
