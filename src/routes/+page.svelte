<script lang="ts">
	import { Parser, Switch } from 'rain-svelte-components/package';
	import { signer, defaultEvmStores } from 'svelte-ethers-store';

	const connect = () => {
		defaultEvmStores.setProvider();
	};
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Switch />
<Parser signer={$signer} />
