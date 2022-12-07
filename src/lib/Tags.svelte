<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let tag = '';
	let arrelementsmatch: { label: string; search: string }[] = [];
	let autoCompleteIndex = -1;
	let regExpEscape = (s: string) => {
		return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
	};
	type ObjectTag = { [completeKey: string]: string };
	export let tags: string[] | ObjectTag[] = [];
	export let addKeys: string[] = ['Enter', 'Tab'];
	export let maxTags: number | false = false;
	export let onlyUnique = false;
	export let removeKeys: string[] = ['Backspace'];
	export let placeholder = 'add...';
	export let allowPaste = false;
	export let allowDrop = false;
	export let splitWith = ',';
	export let autoComplete: string[] | Function | false = false;
	export let autoCompleteFilter = true;
	export let autoCompleteKey: string | false = false;
	export let autoCompleteMarkupKey: string | false = false;
	export let name = 'svelte-tags-input';
	export let id = uniqueID();
	export let allowBlur = false;
	export let disable = false;
	export let minChars = 1;
	export let onlyAutocomplete = false;
	export let labelText = name;
	export let labelShow = false;
	let layoutElement: HTMLDivElement;

	// $: maxTags = maxTags || false;
	// $: onlyUnique = onlyUnique || false;
	// $: removeKeys = removeKeys || [8];
	// $: placeholder = placeholder || '';
	// $: allowPaste = allowPaste || false;
	// $: allowDrop = allowDrop || false;
	// $: splitWith = splitWith || ',';
	// $: autoComplete = autoComplete || false;
	// $: autoCompleteFilter = typeof autoCompleteFilter == 'undefined' ? true : false;
	// $: autoCompleteKey = autoCompleteKey || false;
	// $: autoCompleteMarkupKey = autoCompleteMarkupKey || false;
	// $: name = name || 'svelte-tags-input';
	// $: id = id || uniqueID();
	// $: allowBlur = allowBlur || false;
	// $: disable = disable || false;
	// $: minChars = minChars || 1;
	// $: onlyAutocomplete = onlyAutocomplete || false;
	// $: labelText = labelText || name;
	// $: labelShow = labelShow || false;
	$: matchsID = id + '_matchs';
	let storePlaceholder = placeholder;
	const setTag = (e: KeyboardEvent) => {
		if (!(e.target instanceof HTMLInputElement)) return;
		const currentTag = e.target?.value;

		if (addKeys) {
			addKeys.forEach(function (key) {
				if (key === e.code) {
					if (currentTag) e.preventDefault();

					if (autoComplete && document.getElementById(matchsID)) {
						addTag(arrelementsmatch?.[autoCompleteIndex]?.label);
					} else {
						addTag(currentTag);
					}
				}
			});
		}

		if (removeKeys) {
			removeKeys.forEach(function (key) {
				if (key === e.code && tag === '') {
					tags.pop();
					tags = tags;
					dispatch('tags', {
						tags: tags
					});
					arrelementsmatch = [];
					const input = document.getElementById(id) as HTMLInputElement;
					input.readOnly = false;
					placeholder = storePlaceholder;
					document.getElementById(id)?.focus();
				}
			});
		}

		// ArrowDown : focus on first element of the autocomplete
		if (e.code === 'ArrowDown' && autoComplete && document.getElementById(matchsID)) {
			// Last element on the list ? Go to the first
			if (autoCompleteIndex + 1 === arrelementsmatch.length) autoCompleteIndex = 0;
			else autoCompleteIndex++;
		} else if (e.code === 'ArrowUp') {
			// ArrowUp
			// First element on the list ? Go to the last
			if (autoCompleteIndex <= 0) autoCompleteIndex = arrelementsmatch.length - 1;
			else autoCompleteIndex--;
		} else if (e.code === 'Escape') {
			// Escape
			arrelementsmatch = [];
			document.getElementById(id)?.focus();
		}
	};
	function addTag(currentTag: string | ObjectTag) {
		let currentObjTags: ObjectTag;
		if (typeof currentTag === 'object' && currentTag !== null) {
			if (!autoCompleteKey) {
				return console.error(
					"'autoCompleteKey' is necessary if 'autoComplete' result is an array of objects"
				);
			}
			currentObjTags = currentTag;
			currentTag = currentTag[autoCompleteKey].trim();
		} else {
			currentTag = currentTag.trim();
		}

		const isStringArray = (array: any[]): array is string[] => {
			return Array.isArray(array) && array.every((el) => typeof el === 'string');
		};

		if (currentTag == '') return;
		if (maxTags && tags.length == maxTags) return;
		if (
			onlyUnique &&
			isStringArray(tags) &&
			typeof currentTag === 'string' &&
			tags.includes(currentTag)
		)
			return;
		if (onlyAutocomplete && arrelementsmatch.length === 0) return;

		tags.push(currentObjTags ? currentObjTags : currentTag);
		tags = tags;
		tag = '';
		dispatch('tags', {
			tags: tags
		});

		// Hide autocomplete list
		// Focus on svelte tags input
		arrelementsmatch = [];
		autoCompleteIndex = -1;
		const input = document.getElementById(id) as HTMLInputElement;
		input.focus();
		if (maxTags && tags.length == maxTags) {
			input.readOnly = true;
			placeholder = '';
		}
	}
	function removeTag(i: number) {
		tags.splice(i, 1);
		tags = tags;
		dispatch('tags', {
			tags: tags
		});
		const input = document.getElementById(id) as HTMLInputElement;
		// Hide autocomplete list
		// Focus on svelte tags input
		arrelementsmatch = [];
		input.readOnly = false;
		placeholder = storePlaceholder;
		input.focus();
	}
	function onPaste(e: ClipboardEvent) {
		if (!allowPaste) return;
		e.preventDefault();
		const data = getClipboardData(e);
		splitTags(data).map((tag) => addTag(tag));
	}
	function onDrop(e: DragEvent) {
		if (!allowDrop) return;
		e.preventDefault();
		if (!('dataTransfer' in e)) return;
		const data = e.dataTransfer?.getData('Text');
		if (data) splitTags(data).map((tag) => addTag(tag));
	}
	function onFocus() {
		layoutElement.classList.add('focus');
	}
	function onBlur(e: FocusEvent, tag: string) {
		layoutElement.classList.remove('focus');
		if (allowBlur) {
			// A match is highlighted
			if (arrelementsmatch.length && autoCompleteIndex > -1) {
				addTag(arrelementsmatch?.[autoCompleteIndex]?.label);
			}
			// There is no match, but we may add a new tag
			else if (!arrelementsmatch.length) {
				e.preventDefault();
				addTag(tag);
			}
		}
		arrelementsmatch = [];
		autoCompleteIndex = -1;
	}
	function onClick() {
		(!minChars || minChars == 0) && getMatchElements();
	}
	function getClipboardData(e: ClipboardEvent) {
		if (window.clipboardData) {
			return window.clipboardData.getData('Text');
		}
		if (e.clipboardData) {
			return e.clipboardData.getData('text/plain');
		}
		return '';
	}
	function splitTags(data: string) {
		return data.split(splitWith).map((tag) => tag.trim());
	}
	function escapeHTML(string: string) {
		const htmlEscapes: { [name: string]: string } = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			'/': '&#x2F;'
		};
		return ('' + string).replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
	}
	function buildMatchMarkup(search: string, value: string) {
		return escapeHTML(value).replace(
			RegExp(regExpEscape(search.toLowerCase()), 'i'),
			'<strong>$&</strong>'
		);
	}
	async function getMatchElements(input?: KeyboardEvent) {
		if (!autoComplete) return;
		if (maxTags && tags.length >= maxTags) return;

		let value = input?.target instanceof HTMLInputElement ? input.target?.value : '';
		let autoCompleteValues: any[] = [];

		if (Array.isArray(autoComplete)) {
			autoCompleteValues = autoComplete;
		}

		if (typeof autoComplete === 'function') {
			if (autoComplete.constructor.name === 'AsyncFunction') {
				autoCompleteValues = await autoComplete(value);
			} else {
				autoCompleteValues = autoComplete(value);
			}
		}
		if (autoCompleteValues.constructor.name === 'Promise') {
			autoCompleteValues = await autoCompleteValues;
		}

		// Escape
		if (
			(minChars > 0 && value == '') ||
			(input && input.code === 'Escape') ||
			value.length < minChars
		) {
			arrelementsmatch = [];
			return;
		}
		let matchs = autoCompleteValues;

		if (typeof autoCompleteValues[0] === 'object' && autoCompleteValues !== null) {
			if (autoCompleteKey == false) {
				return console.error(
					"'autoCompleteValue' is necessary if 'autoComplete' result is an array of objects"
				);
			}
			if (autoCompleteFilter !== false) {
				matchs = autoCompleteValues.filter(
					(e) =>
						typeof autoCompleteKey === 'string' &&
						e[autoCompleteKey].toLowerCase().includes(value.toLowerCase())
				);
			}
			if (typeof autoCompleteKey === 'string') {
				matchs = matchs.map((matchTag) => {
					return {
						label: matchTag,
						search: autoCompleteMarkupKey
							? matchTag[autoCompleteMarkupKey]
							: buildMatchMarkup(value, matchTag[autoCompleteKey as string])
					};
				});
			}
		} else {
			if (autoCompleteFilter !== false) {
				matchs = autoCompleteValues.filter((e) => e.toLowerCase().includes(value.toLowerCase()));
			}
			matchs = matchs.map((matchTag) => {
				return {
					label: matchTag,
					search: buildMatchMarkup(value, matchTag)
				};
			});
		}
		if (onlyUnique === true && !autoCompleteKey) {
			matchs = matchs.filter((tag) => !tags.includes(tag.label));
		}
		arrelementsmatch = matchs;
	}
	function uniqueID() {
		return 'sti_' + Math.random().toString(36).substring(2, 11);
	}
</script>

<div class="svelte-tags-input-layout" class:sti-layout-disable={disable} bind:this={layoutElement}>
	<label for={id} class={labelShow ? '' : 'sr-only'}>{labelText}</label>
	{#if tags.length > 0}
		{#each tags as tag, i}
			<span class="svelte-tags-input-tag">
				{#if typeof tag === 'string'}
					{tag}
				{:else if typeof autoCompleteKey === 'string'}
					{tag[autoCompleteKey]}
				{/if}
				{#if !disable}
					<span class="svelte-tags-input-tag-remove" on:pointerdown={() => removeTag(i)}>
						&#215;</span
					>
				{/if}
			</span>
		{/each}
	{/if}
	<input
		type="text"
		{id}
		{name}
		bind:value={tag}
		on:keydown={setTag}
		on:keyup={getMatchElements}
		on:paste={onPaste}
		on:drop={onDrop}
		on:focus={onFocus}
		on:blur={(e) => onBlur(e, tag)}
		on:pointerdown={onClick}
		class="svelte-tags-input"
		{placeholder}
		disabled={disable}
		autocomplete="off"
	/>
</div>
{#if autoComplete && arrelementsmatch.length > 0}
	<div class="svelte-tags-input-matchs-parent">
		<ul id="{id}_matchs" class="svelte-tags-input-matchs">
			{#each arrelementsmatch as element, index}
				<li
					tabindex="-1"
					class:focus={index === autoCompleteIndex}
					on:pointerdown|preventDefault={() => addTag(element.label)}
				>
					{@html element.search}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style lang="postcss">
	/* CSS svelte-tags-input */
	.svelte-tags-input,
	.svelte-tags-input-tag,
	.svelte-tags-input-matchs,
	.svelte-tags-input-layout label {
		/* font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		font-size: 14px; */
		padding: 2px 5px;
	}
	.svelte-tags-input-layout label {
		margin: 4px 5px 0 0;
		padding: 0;
		font-weight: 500;
	}
	/* svelte-tags-input-layout */
	.svelte-tags-input-layout {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		padding: 0px 5px 5px 5px;
		background: #fff;
		@apply border border-gray-200 rounded-lg;
	}
	.svelte-tags-input-layout:focus {
		@apply outline-none;
	}
	.svelte-tags-input-layout:focus-within {
		outline: 5px auto -webkit-focus-ring-color;
	}
	/* svelte-tags-input */
	.svelte-tags-input {
		-webkit-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
		margin: 0;
		margin-top: 5px;
		border: none;
	}
	.svelte-tags-input:focus {
		outline: 0;
	}
	/* svelte-tags-input-tag */
	.svelte-tags-input-tag {
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		white-space: nowrap;
		list-style: none;
		margin-right: 5px;
		margin-top: 5px;
		@apply rounded-md bg-gray-100 px-2 leading-none py-1;
	}
	/*.svelte-tags-input-tag:hover {
        background: #CCC;
    }*/
	.svelte-tags-input-tag-remove {
		cursor: pointer;
	}
	/* svelte-tags-input-matchs */
	.svelte-tags-input-matchs-parent {
		position: relative;
	}
	.svelte-tags-input-matchs {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		margin: 3px 0;
		padding: 0px;
		background: #fff;
		border: solid 1px #ccc;
		border-radius: 2px;
		max-height: 310px;
		overflow: scroll;
		overflow-x: auto;
	}
	.svelte-tags-input-matchs li {
		list-style: none;
		padding: 5px;
		border-radius: 2px;
		cursor: pointer;
	}
	.svelte-tags-input-matchs li:hover,
	.svelte-tags-input-matchs li.focus {
		background: #000;
		color: #fff;
		outline: none;
	}
	/* svelte-tags-input disabled */
	.svelte-tags-input-layout.sti-layout-disable,
	.svelte-tags-input:disabled {
		background: #eaeaea;
		cursor: not-allowed;
	}
	.svelte-tags-input-layout.sti-layout-disable:hover,
	.svelte-tags-input-layout.sti-layout-disable:focus {
		border-color: #ccc;
	}
	.svelte-tags-input-layout.sti-layout-disable .svelte-tags-input-tag {
		background: #aeaeae;
	}
	.svelte-tags-input-layout.sti-layout-disable .svelte-tags-input-tag-remove {
		cursor: not-allowed;
	}
	.svelte-tags-input-layout label.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
