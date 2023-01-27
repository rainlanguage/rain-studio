<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import NewOrgModal from '$lib/user-context/NewOrgModal.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ListBullet } from '@steeze-ui/heroicons';

	import type { Organization } from '$lib/types/app-types';
	import type { PageData } from './$types';
	import { HoverTooltip } from 'rain-svelte-components/package';

	export let data: PageData;
	let openCreateModal: boolean = data.create;
	let organizations: Organization[] = data.organizations ?? [];

	afterNavigate(() => {
		openCreateModal = data.create;
	});
</script>

<NewOrgModal bind:open={openCreateModal} />

<div
	class="my-4 mx-2 flex flex-col items-start items-stretch rounded-[10px] border-[1px] border-neutral-300 sm:w-[500px] sm:self-center"
>
	<div
		class="flex border-b-[1px] border-neutral-300 py-[15px] pl-[10px] text-[18px] font-medium leading-[23px] tracking-[-0.01em]"
	>
		<p class="mx-auto">Organizations</p>
	</div>
	<table class="">
		<thead class="border-b border-neutral-300">
			<tr class="border-b border-neutral-300 [&>*]:p-2">
				<th>Name</th>
				<th>Nickname</th>
				<th>Role</th>
			</tr>
		</thead>

		{#if organizations.length}
			{#each organizations as organization}
				<tbody>
					<tr class="[&>*]:py-2">
						<td class="text-center">{organization.info_org.name}</td>
						<td class="text-center">
							@{organization.info_org.nickname}
						</td>
						<td class="text-center">{organization.role}</td>
						<td>
							<HoverTooltip
								placeHolder={organization.role == 'admin'
									? 'Manage the organization'
									: 'Go to the organization'}
							>
								<button
									class=" hover:underline hover:underline-offset-4"
									on:click={() => goto(`/organization/${organization.info_org.nickname}`)}
								>
									<Icon class="h-6" src={ListBullet} />
								</button>
							</HoverTooltip>
						</td>
					</tr>
				</tbody>
			{/each}
		{/if}
	</table>
	<!-- </div> -->
</div>
