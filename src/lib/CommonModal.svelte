<script lang="ts">
	import { Button, Modal } from 'rain-svelte-components/package';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { IconSource } from '@steeze-ui/heroicons/types';

	export let open = false;
	export let message = '';
	export let textSize = '20px';

	export let icon: IconSource | undefined = undefined;
	export let solidIcon = false;
	export let iconColor = 'text-black';
</script>

<Modal bind:open>
	<div class="flex w-full flex-col gap-5">
		<div class="flex w-fit flex-col items-center gap-2.5">
			{#if icon != undefined}
				<Icon
					src={icon}
					theme={solidIcon ? 'solid' : ''}
					class={`mr-1.5 h-16 w-16 py-0.5 ${iconColor}`}
				/>
			{/if}
			<p class={`text-[${textSize}]`}>{message}</p>
		</div>
		<div class="flex justify-center">
			<Button variant="primary" on:click={() => (open = false)}>Continue</Button>
		</div>
	</div>
</Modal>
