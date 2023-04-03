<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CheckBadge } from '@steeze-ui/heroicons';

	export let logoUrl: string, name: string;
</script>

<div class="flex items-center gap-x-2">
	<img alt={`logo for ${name}`} src={logoUrl} class="w-7" />
	<span>{name}</span>
	<div class="w-6 text-blue-600">
		<Icon src={CheckBadge} theme="solid" />
	</div>
</div>
