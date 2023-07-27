import { browser } from '$app/environment';
import { PUBLIC_WALLETCONNECT_ID, PUBLIC_ALCHEMY_ID } from '$env/static/public';
import { get } from 'svelte/store';

import { defaultConfig, wagmiLoaded, web3Modal, disconnectWagmi, chainId } from 'svelte-wagmi';
import { switchNetwork } from '@wagmi/core';
import { defaultChains, getNetworkByChainId } from '$lib/utils';

// Initialize this once the app is load
if (browser) {
	if (!get(wagmiLoaded)) {
		const erckit = defaultConfig({
			appName: 'rain-studio',
			chains: defaultChains,
			walletConnectProjectId: PUBLIC_WALLETCONNECT_ID,
			alchemyId: PUBLIC_ALCHEMY_ID
		});
		erckit.init();
	}
}

/**
 * Connect wallet using wallet connect modal.
 *
 * If want to connect without using the modal, try using `connection()` from
 * svelte-wagmi
 */
export const connectWallet = async () => {
	get(web3Modal).openModal();

	get;
};

export const disconectWallet = async () => {
	await disconnectWagmi();
};

/**
 * Ask to provider to change the newtork to a given `chainId` using wagmi
 */
export const changeNetwork = async (
	chainId_: number | string
): Promise<{ success: boolean; message: string }> => {
	// Read the store
	const _currentChain = get(chainId);

	if (_currentChain == chainId_) return { success: true, message: 'Chain is currently selected' };

	const chainData = getNetworkByChainId(chainId_);

	if (!chainData) {
		return { success: false, message: 'Rain Studio cannot handle this chain' };
	}

	try {
		await switchNetwork({ chainId: chainData.id });

		return { success: true, message: 'Chain was switched succesfully' };
	} catch (switchChainError) {
		// To get more information about switch error
		console.log(switchChainError);
		return { success: false, message: 'Oops! Chain could not be switched' };
	}
};
