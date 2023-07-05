<script lang="ts">
	import ConnectWallet from '$lib/connect-wallet/ConnectWallet.svelte';
	import { chainId, connected, provider, signer } from 'svelte-ethers-store';

	import {
		getKnownContractAddressesForChain,
		getNameFromChainId,
		getCommonChains
	} from '$lib/contracts';

	import type { ContractAddressRow, DeployerAddressesRow } from '$lib/types/types';
	import { Button } from '@rainprotocol/rain-svelte-components';
	import { ethers } from 'ethers';
	import { method } from 'lodash-es';

	export let abi: any,
		// export let contractAddresses: ContractAddressRow[],
		// 	deployerAddresses: DeployerAddressesRow[],
		metadata: any,
		contract_meta: any;
	// 	abi: any;

	const check = () => {
		const method = contract_meta.methods.find((method_: any) => {
			return method_.name == 'initialize';
		});

		console.log(contract_meta);
		console.log(method);

		console.log(abi);
		console.log(metadata);
		// const encoder = new ethers.utils.AbiCoder(abi);
		// encoder.encode()
		// console.log(encoder);
	};
</script>

<Button on:click={check}>Click me</Button>
<div>
	<p>xd ajsfa sjfakf ajsfa</p>
</div>
