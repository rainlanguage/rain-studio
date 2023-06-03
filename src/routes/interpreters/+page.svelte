<script lang="ts">
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabaseClient';
	import { Button } from '@rainprotocol/rain-svelte-components';

	const getInterpreters = async () => {
		const resp = await fetch(`${$page.url.origin}/interpreters`, {
			method: 'POST',
			body: JSON.stringify({
				// searchValue: '0x0624608eda7be229a16151f1e22826bfd28871e9',
				searchValue: '',
				// selectedNetworks: [137],
				// selectedNetworks: [137],
				selectedNetworks: [-1],
				offset_: 0
			})
		});

		if (resp.ok) {
			const data_ = await resp.json();

			console.log(data_);

			// const data3 = interpreters.filter((deployer_: any) => {
			// 	return deployer_.deployers_addresses.length > 1;
			// });
			// console.log(data3);
		} else {
			console.log(resp.status);
			console.log(resp.statusText);
		}

		// {
		// 	const data2 = data?.filter((deployer_) => {
		// 		const aver = deployer_.deployers_addresses?.find(
		// 			(addresses_) => addresses_.chain_id == 80001
		// 		);

		// 		return aver;
		// 	});
		// 	console.log(data2);

		// 	const data3 = data.filter((deployer_) => {
		// 		return deployer_.deployers_addresses.length > 1;
		// 	});
		// 	console.log(data3);
		// 	// console.log(
		// 	// 	data?.filter((e_) => {
		// 	// 		//
		// 	// 		return e_.deployers_addresses?.valueOf('chain_id');
		// 	// 	})
		// 	// );
		// }
	};
</script>

Interpreters
<div>
	<Button on:click={getInterpreters}>Fetch</Button>
</div>
