<script lang="ts">
	export let alignItems: 'items-start' | 'items-end' | 'items-center' = 'items-center';
	export let justifyContent: 'justify-start' | 'justify-end' | 'justify-center' = 'justify-center';
</script>

<div class={`w-full flex-grow bg-gray-100 flex ${alignItems} ${justifyContent}`}>
	<slot />
</div>
