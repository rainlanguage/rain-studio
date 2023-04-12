<script lang="ts">
	import { Heart, ArrowUp, ArrowDown, ChatBubbleLeft } from '@steeze-ui/heroicons';
	import { Section, SectionBody } from '@rainprotocol/rain-svelte-components/section';
	import { DisplayAddress, Ring, Modal } from '@rainprotocol/rain-svelte-components';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import Auth from '$lib/Auth.svelte';
	import SidebarHeading from '$lib/SidebarHeading.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import SocialButton from '$lib/SocialButton.svelte';
	import { supabaseClient } from '$lib/supabaseClient';

	import type { UserLikes, ExpressionLikes, AccountData } from './types';
	import ForkableFormatter from '$lib/expressions/ForkableFormatter.svelte';
	import type { ContractRowFull } from '$lib/types/types';
	import AuthInner from '$lib/AuthInner.svelte';

	export let contract: ContractRowFull;

	let expressionsToShow: any[] = [];
	let isLoading = true;
	let showMore = false;
	let openAuthModal = false;
	let amountExpressionToShow = 5;

	let session = $page.data.session;
	let expressionSG: any[] = $page.data.expressionSG;
	let accountsData: AccountData = $page.data.accountsData;
	let userLikes: UserLikes = $page.data.userLikes;
	let expressionLikes: ExpressionLikes = $page.data.expressionLikes;

	const clickLike = async (address: string) => {
		if (session) {
			if (userLikes[address]) {
				const { error } = await supabaseClient
					.from('starred')
					.delete()
					.eq('user_id', session.user.id)
					.eq('address', address);

				if (!error) {
					expressionLikes[address] -= 1;
					userLikes[address] = !userLikes[address];
				}
			} else {
				const { error } = await supabaseClient.from('starred').insert({
					starred: 'expression',
					address: address
				});

				if (!error) {
					expressionLikes[address] = (expressionLikes[address] ?? 0) + 1;
					userLikes[address] = !userLikes[address];
				}
			}
		} else {
			openAuthModal = true;
		}
	};

	const seeAll = () => {
		if (showMore) amountExpressionToShow = 5;
		else amountExpressionToShow = expressionSG.length;

		showMore = !showMore;
		expressionsToShow = expressionSG?.slice(0, amountExpressionToShow);
	};

	////////////////////////////////////////
	// TODO: Use data to social numbers like UpVotes/DownVotes, Likes, Comments
	let _votes: { [key: number]: { upVote?: boolean; downVote?: boolean } } = {};
	let _comments: { [key: number]: boolean } = {};

	const upVote = (id_: number) => {
		if (_votes[id_] === undefined) {
			_votes[id_] = {};
		}

		if (_votes[id_].upVote) {
			_votes[id_].upVote = false;
		} else {
			_votes[id_].upVote = true;
		}

		_votes[id_].downVote = false;
	};

	const downVote = (id_: number) => {
		if (_votes[id_] === undefined) {
			_votes[id_] = {};
		}

		if (_votes[id_]?.downVote) {
			_votes[id_].downVote = false;
		} else {
			_votes[id_].downVote = true;
		}

		_votes[id_].upVote = false;
	};

	const comments = (id_: number) => {
		_comments[id_] = !_comments[id_];
	};
	//////////////////////////////////////////

	onMount(() => {
		expressionsToShow = expressionSG?.slice(0, amountExpressionToShow);
		isLoading = false;
	});
</script>

<div class="w-full">
	<Section>
		<SidebarHeading>Recently deployed</SidebarHeading>
		<SectionBody>
			{#if !isLoading}
				<div in:fade class="flex flex-col gap-y-4">
					{#if expressionsToShow && expressionsToShow.length > 0}
						{#each expressionsToShow as { id, name, config, event, account }, index}
							<div class="flex flex-col gap-y-2.5 border-b border-slate-200 pb-[10px]">
								<div
									class="overflow-hidden rounded-[5px] bg-neutral-100 font-mono text-[12px] leading-4 tracking-[-0.01em]"
								>
									<ForkableFormatter
										maxHeight="150px"
										stateConfig={{
											sources: config.sources,
											constants: config.constants
										}}
										contract={contract.id}
									/>
								</div>
								<div class="flex items-center gap-x-3.5 text-[13px] text-neutral-500">
									<TimeAgo dateString={event.transaction.timestamp * 1000} />
									<div class="flex items-center gap-x-1">
										<UserAvatar url={accountsData[account.id]?.avatar_url ?? ''} size={13} />
										{#if accountsData[account.id]}
											{accountsData[account.id].username}
										{:else}
											<DisplayAddress address={account.id} />
										{/if}
									</div>
									<div class="flex">
										<SocialButton
											on:click={() => upVote(index)}
											isActived={_votes[index]?.upVote}
											colorActive="green"
											icon={ArrowUp}
											iconTheme="solid"
										>
											{43}
										</SocialButton>
										<SocialButton
											on:click={() => downVote(index)}
											isActived={_votes[index]?.downVote}
											colorActive="red"
											icon={ArrowDown}
											iconTheme="solid"
										>
											{2}
										</SocialButton>
									</div>
									<div>
										<SocialButton
											on:click={() => clickLike(id)}
											isActived={userLikes[id]}
											colorActive="red"
											icon={Heart}
											iconTheme={userLikes[id] ? 'solid' : ''}
											iconSize="13"
										>
											{expressionLikes[id] ?? 0}
										</SocialButton>
									</div>
									<div>
										<SocialButton
											on:click={() => comments(index)}
											isActived={_comments[index]}
											colorActive="green"
											icon={ChatBubbleLeft}
											iconTheme={_comments[index] ? 'solid' : ''}
											iconSize="13"
										>
											{201}
										</SocialButton>
									</div>
								</div>
							</div>
						{/each}
						<div
							class="hover: self-center text-[13px] leading-[17px] tracking-[-0.01em] text-black"
						>
							<button on:click={seeAll}>{showMore ? 'Hide' : 'See all'}</button>
						</div>
					{:else}
						<div class="text-[15px] text-neutral-500">Nothing to show</div>
					{/if}
				</div>
			{:else}
				<div class="self-center">
					<Ring size="40px" color="#cbd5e1" />
				</div>
			{/if}
		</SectionBody>
	</Section>
</div>

<Modal bind:open={openAuthModal}>
	<AuthInner />
</Modal>
