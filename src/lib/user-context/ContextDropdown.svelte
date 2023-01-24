<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { userContextData } from '$lib/stores';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import { ChevronUpDown, PlusCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { fly } from 'svelte/transition';
	import { handleSetContext } from '$lib/user-context';

	export let isOpen: boolean;

	const openContextMenu = () => {
		isOpen = !isOpen;
	};
</script>

<div class="relative flex flex-col items-center">
	<button class="flex items-center" on:click={openContextMenu}>
		<div>{$userContextData?.nickname}</div>
		<div class="pt-0.5">
			<Icon src={ChevronUpDown} size={'20'} />
		</div>
	</button>
	{#if isOpen}
		<div transition:fly={{ duration: 300, y: 10 }} class="context-container">
			<div class="flex flex-col gap-y-1">
				<button
					class="context-option"
					on:click={() => handleSetContext($page.data.profile, 'user')}
				>
					<UserAvatar url={$page.data.profile?.avatar_url} />
					{$page.data.profile.username}
				</button>
				{#if $page.data.organizations && $page.data.organizations.length}
					{#each $page.data.organizations as organization}
						<button class="context-option" on:click={() => handleSetContext(organization, 'org')}>
							<UserAvatar isOrg url={organization.info_org.avatar_url} />
							{organization.info_org.name}
						</button>
					{/each}
				{/if}
			</div>
			<div class="flex border-t-[1px] border-gray-200">
				<button
					class="context-option w-full mt-2"
					on:click={() => goto('/organizations?ref=create')}
				>
					<Icon src={PlusCircle} size={'30'} />
					Create organization
				</button>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.context-container {
		@apply absolute right-0 -bottom-4 flex flex-col gap-y-2 translate-y-full w-56 py-3;
		@apply bg-white shadow-md border border-gray-100 rounded-xl;
	}
	.context-option {
		@apply flex gap-x-2.5 p-1 mx-1 cursor-pointer hover:bg-gray-200 rounded-lg;
	}
</style>
