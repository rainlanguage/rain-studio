<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import CommonModal from '$lib/CommonModal.svelte';
	import { supabaseClient } from '$lib/supabaseClient';
	import { CheckCircle, ExclamationTriangle } from '@steeze-ui/heroicons';
	import { Button, Input, Modal, Ring } from 'rain-svelte-components/package';

	export let open = false;

	let orgName = '';
	let orgNickname = '';
	let error: null | string = null;
	let modalErrorMsg: string;
	let modalError = false;
	let modalSuccess = false;
	let loading = false;

	const close = () => (open = false);

	const nicknameValidate = async (value: string) => {
		const hasInvalidChars = (value_: string): boolean => {
			if (value.indexOf(' ') >= 0) {
				return true;
			}

			return false;
		};

		if (hasInvalidChars(value)) {
			return { error: 'Nickname can not have spaces' };
		}

		const { data, error } = await supabaseClient
			.from('organizations')
			.select('*')
			.eq('nickname', value.toLowerCase());

		if (error) {
			return { error: 'Something went wrong' };
		}

		if (data && data.length) {
			return { error: 'Nickname is already taken' };
		}
	};

	const submitFunction: SubmitFunction = async ({ data, cancel }) => {
		loading = true;
		const orgName = data.get('OrgName')?.toString();
		const orgNickname = data.get('OrgNickname')?.toString();

		if (!orgName || !orgNickname) {
			loading = false;
			error = 'The fields cannot be empty';
			cancel();
			return;
		}

		const _checkNickname = await nicknameValidate(orgNickname);
		if (_checkNickname?.error) {
			loading = false;
			error = _checkNickname.error;
			cancel();
		}

		return async ({ result, update }) => {
			if (result.type === 'failure') {
				modalError = true;
				error = result.data?.error;
			}
			if (result.type === 'success') {
				modalSuccess = true;
				close();
			}

			loading = false;

			update({ reset: false });
		};
	};
</script>

<div>
	<Modal bind:open>
		<form
			method="POST"
			action="/organizations?/newOrg"
			class="flex w-full flex-col gap-5"
			use:enhance={submitFunction}
		>
			<div class="flex w-fit flex-col gap-2.5">
				<p class="text-[25px]">Create a new organization</p>
			</div>

			<Input name="OrgName" type="text" placeholder="My Organization" bind:value={orgName}>
				<span slot="label">Name</span>
			</Input>
			<Input name="OrgNickname" type="text" placeholder="Eg: my_org" bind:value={orgNickname}>
				<span slot="label">Nickname</span>
			</Input>
			{#if error}
				<span class="text-red-500">{error}</span>
			{/if}

			<div class="flex gap-3.5">
				<Button type="submit" variant="primary">Create</Button>
				<Button type="button" variant="black" on:click={close}>Cancel</Button>
			</div>
			{#if loading}
				<div class="flex w-full justify-center">
					<Ring size="40px" color="#cbd5e1" />
				</div>
			{/if}
		</form>
	</Modal>
</div>

<!-- Modal success -->
<CommonModal
	bind:open={modalSuccess}
	message="The organization has been created succesfully"
	icon={CheckCircle}
	iconColor="text-green-500"
/>

<!-- Modal error -->
<CommonModal
	bind:open={modalError}
	message={modalErrorMsg}
	icon={ExclamationTriangle}
	iconColor="text-red-600"
/>
