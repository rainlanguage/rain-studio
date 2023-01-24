<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	import { fade, fly } from 'svelte/transition';
	import { Button } from 'rain-svelte-components/package';
	import SplineScene from '$lib/homepage/SplineScene.svelte';
	import { onMount } from 'svelte';
	import { ecosystemProjects, expressionExamples, features, rainLinks } from '$lib/homepage/data';
	import Formatter from 'rain-svelte-components/package/formatter/Formatter.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowUpRight } from '@steeze-ui/heroicons';
	import { goto } from '$app/navigation';

	let show = false;
	onMount(() => {
		show = true;
	});

	let activeExample = 0;
</script>

<div class="w-full">
	<!-- hero -->
	<div class="relative flex h-[80vh] flex-col items-center justify-center bg-rainsecondary">
		<div class="container z-10 mx-auto">
			<div class="flex h-full w-full flex-col gap-y-8 px-8 sm:px-0 lg:w-1/2">
				<span class="text-4xl font-bold"
					>The on-chain language for <span class="text-rainprimary">everyone.</span></span
				>
				<span class="text-xl"
					>Rain Studio is the ultimate platform for creating smart contracts and blockchain-based
					applications using Rainlang.</span
				>
				<div>
					<Button
						on:click={() => {
							goto('/sign-in');
						}}
						variant="rain-primary">Sign up</Button
					>
					<Button
						on:click={() => {
							goto('/expressions');
						}}>Discover</Button
					>
				</div>
			</div>
		</div>
		{#if show}
			<div in:fade class="absolute inset-0">
				<SplineScene />
			</div>
		{/if}
	</div>

	<!-- express yourself -->
	<div class="container mx-auto flex flex-col items-center gap-y-20 py-32 px-8 sm:px-0">
		<div class="flex flex-col items-center gap-y-8">
			<span class="text-4xl font-semibold">Express yourself.</span>
			<span class="w-full max-w-3xl text-center text-xl"
				>Rainlang Expressions are executed by the Rain Interpreter, enabling you to perform
				calculations on-chain and use the results to accomplish tasks like writing order strategies,
				or minting, burning and transferring tokens.</span
			>
			<Button
				on:click={() => {
					goto('/expressions');
				}}>Discover community expressions</Button
			>
		</div>
		<div class="flex w-full max-w-6xl flex-col gap-12 md:flex-row">
			<div class="flex flex-grow flex-col divide-y">
				{#each expressionExamples as example, i}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={() => {
							activeExample = i;
						}}
						class="flex cursor-pointer flex-col gap-y-2 py-6"
						class="flex cursor-pointer flex-col gap-y-2 py-6"
						use:autoAnimate
					>
						<span class={`text-2xl font-semibold ${activeExample == i ? 'text-rainprimary' : ''}`}
							>{example.name}</span
						>
						{#if activeExample == i}
							<span class="text-lg">{example.description}</span>
						{/if}
					</div>
				{/each}
			</div>
			<div class="w-full flex-shrink-0 md:w-3/5">
				{#key activeExample}
					<Formatter raw={expressionExamples[activeExample].expression} maxHeight="400px" />
				{/key}
			</div>
		</div>
	</div>

	<!-- features -->
	<div class="bg-rainsecondary py-32">
		<div class="container mx-auto flex flex-col items-center gap-y-20 px-8 sm:px-0">
			<div class="flex flex-col items-center gap-y-8">
				<span class="text-center text-4xl font-semibold"
					>Write, test and deploy your smart contracts with Studio.</span
				>
				<span class="w-full text-center text-xl xl:w-1/2"
					>Our user-friendly interface and powerful simulation tools make it easy to learn and use
					Rainlang, even if you have no previous experience with smart contract development. And
					with our community features, you can collaborate with other users, share your expressions,
					and learn from the best.</span
				>
				<Button
					on:click={() => {
						goto('/docs');
					}}>Learn how to write expressions</Button
				>
			</div>
			<div class="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-4">
				{#each features as feature}
					<div class="flex flex-col gap-y-4 rounded-3xl bg-white p-12">
					<div class="flex flex-col gap-y-4 rounded-3xl bg-white p-12">
						<img class="w-20" alt={feature.title} src={feature.image} />
						<span class="text-2xl font-semibold">{feature.title}</span>
						<span class="text-2xl font-semibold">{feature.title}</span>
						<span>{feature.description}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- ecosystem -->
	<div class="bg-white py-32">
		<div class="container mx-auto flex flex-col items-center gap-y-20 px-8 sm:px-0">
			<div class="flex flex-col items-center gap-y-2">
				<span class="uppercase">Ecosystem</span>
				<span class="max-w-[700px] text-center text-4xl font-semibold"
				<span class="max-w-[700px] text-center text-4xl font-semibold"
					>The smartest projects, building better, faster, cheaper with Rain.</span
				>
			</div>
			<div class="flex flex-col gap-x-8 gap-y-8 lg:flex-row">
				{#each ecosystemProjects as project}
					<div class="flex flex-col gap-y-4 rounded-3xl bg-gray-100 px-12 py-6">
					<div class="flex flex-col gap-y-4 rounded-3xl bg-gray-100 px-12 py-6">
						<img class="h-8" alt={project.name} src={project.logo} />
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- rain -->
	<div
		class="bg-gray-800 text-white"
		style={`background-image: url("${
			new URL('$lib/homepage/images/rain-section-bg.svg', import.meta.url).href
		}"); background-size: auto 100%; background-position: right; background-repeat:no-repeat;`}
	>
		<div class="container mx-auto flex items-center gap-y-20 px-8 sm:px-0">
			<div class="flex w-full flex-col gap-x-2 gap-y-20 py-32 lg:w-1/2">
				<div class="flex flex-col gap-y-14">
					<span class="text-4xl font-semibold"
						>Rain Protocol is a framework that enables building web3 economies of any scale.</span
					>
					<div class="flex flex-col gap-y-8 text-xl">
					<div class="flex flex-col gap-y-8 text-xl">
						<p>
							Much of the magic of Rain is due to the Rain Interpreter, a simple way to define and
							run algorithms on-chain, fully compatible with all EVM chains.
						</p>
						<p>
							Rain Expressions are designed to be easily understandable for average users, secure
							and written by non-devs and readable by others. They are deployed with a small
							overhead, about 5-10% more gas than hand-written Solidity code.
						</p>
						<p>
							If the power to read and write is held by a select few, then we live at the mercy of
							their interpretation.
						</p>
						<p>
							Today 20K solidity devs are priests. <span class="font-semibold text-rainprimary"
							Today 20K solidity devs are priests. <span class="font-semibold text-rainprimary"
								>Rain opens up web3 to everybody.</span
							>
						</p>
					</div>
				</div>
				<div class="flex flex-col gap-y-6">
					<span class="text-2xl font-semibold">Learn more about Rain Protocol.</span>
					<div class="flex flex-wrap gap-x-8 text-xl">
						{#each rainLinks as link}
							<div class="flex flex-nowrap gap-x-1">
								<a rel="noreferrer" href={link.url} target="_blank">{link.name}</a>
								<div class="w-4">
									<Icon src={ArrowUpRight} />
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
