<script lang="ts">
	import { Heart, ArrowUp, ArrowDown, ChatBubbleLeft } from '@steeze-ui/heroicons';
	import { Section, SectionBody } from 'rain-svelte-components/package/section';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import { DisplayAddress, Ring, Button } from 'rain-svelte-components/package';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import SidebarHeading from '$lib/SidebarHeading.svelte';
	import TimeAgo from '$lib/TimeAgo.svelte';
	import UserAvatar from '$lib/UserAvatar.svelte';
	import SocialButton from '$lib/SocialButton.svelte';
	import { supabaseClient } from '$lib/supabaseClient';

	let session = $page.data.session;
	let amountToShow = 5;
	let showMore = false;
	let expressionsToShow: any[] = [];
	let _expressionSG: any[] = $page.data.expressionSG;
	let _accountsData: { [key: string]: { username: string; avatar_url: string | null } } =
		$page.data.accountsData;
	let _userLikes: { [key: string]: boolean } = $page.data.userLikes;
	let _expressionLikes: { [key: string]: number } = $page.data.expressionLikes;

	let _loading = true;

	const clickLike = async (address: string) => {
		if (!session) {
			// Ask to login
		} else {
			if (_userLikes[address]) {
				const { error } = await supabaseClient
					.from('starred')
					.delete()
					.eq('user_id', session.user.id)
					.eq('address', address);

				if (!error) {
					_expressionLikes[address] -= 1;
					_userLikes[address] = !_userLikes[address];
				}
			} else {
				const { error } = await supabaseClient.from('starred').insert({
					starred: 'expression',
					address: address
				});

				if (!error) {
					_expressionLikes[address] = (_expressionLikes[address] ?? 0) + 1;
					_userLikes[address] = !_userLikes[address];
				}
			}
		}
	};

	const seeAll = () => {
		if (showMore) amountToShow = 5;
		else amountToShow = _expressionSG.length;

		showMore = !showMore;
		expressionsToShow = _expressionSG?.slice(0, amountToShow);
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
		expressionsToShow = _expressionSG?.slice(0, amountToShow);
		_loading = false;
	});
</script>

<div class="w-full">
	<Section>
		<SidebarHeading>Recently deployed</SidebarHeading>
		<SectionBody>
			{#if !_loading}
				<div in:fade class="flex flex-col gap-y-4">
					{#if expressionsToShow && expressionsToShow.length > 0}
						{#each expressionsToShow as { id, name, config, event, account }, index}
							{id}
							<div class="flex flex-col gap-y-2.5 border-b border-slate-200 pb-[10px]">
								<div
									class="font-mono text-[12px] leading-4 bg-neutral-100 tracking-[-0.01em] rounded-[5px] max-h-[89px] overflow-hidden gradient-mask-b-70"
								>
									<Formatter
										stateConfig={{
											sources: config.sources,
											constants: config.constants
										}}
									/>
								</div>
								<div class="flex gap-x-3.5 text-neutral-500 text-[13px] items-center">
									<TimeAgo dateString={event.transaction.timestamp * 1000} />
									<div class="flex items-center gap-x-1">
										<UserAvatar url={_accountsData[account.id]?.avatar_url ?? ''} size={13} />
										{#if _accountsData[account.id]}
											{_accountsData[account.id].username}
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
											isActived={_userLikes[id]}
											colorActive="red"
											icon={Heart}
											iconTheme={_userLikes[id] ? 'solid' : ''}
											iconSize="13"
										>
											{_expressionLikes[id] ?? 0}
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
							class="self-center text-[13px] leading-[17px] tracking-[-0.01em] text-black hover:"
						>
							<button on:click={seeAll}>{showMore ? 'Hide' : 'See all'}</button>
						</div>
					{:else}
						<div class="text-neutral-500 text-[15px]">Nothing to show</div>
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
