import { ethers } from 'ethers';
import { allChainsData, chainId } from 'svelte-ethers-store';
import { get_store_value } from 'svelte/internal';

/**
 * Ask to provider to change the newtork to a given `chainId`
 */
export const changeNetwork = async (
	chainId_: number | string
): Promise<{ success: boolean; message: string; }> => {
	// Read the store
	const _currentChain = get_store_value(chainId);

	if (_currentChain == chainId_) return { success: true, message: 'Chain is currently selected' };

	const chainData = allChainsData.find((chain_) => chain_.chainId == chainId_);

	if (!chainData) {
		return { success: false, message: 'Rain Studio cannot handle this chain' };
	}

	try {
		await ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: ethers.utils.hexValue(chainData.chainId) }]
		});

		return { success: true, message: 'Chain was switched succesfully' };
	} catch (switchChainError) {
		// This error code mean that the chain has not been added to the wallet.
		if (switchChainError.code === 4902) {
			try {
				await ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: ethers.utils.hexValue(chainData.chainId),
							rpcUrls: chainData.rpc,
							blockExplorerUrls: chainData.explorers.map((explorer) => explorer.url),
							chainName: chainData.name,
							nativeCurrency: chainData.nativeCurrency
						}
					]
				});

				return { success: true, message: 'Chain was added and switched succesfully' };
			} catch (addChainError) {
				// To get more information about add error
				console.log(addChainError);
				return { success: false, message: 'Chain could not be added' };
			}
		} else {
			// other error code or error type
			// To get more information about switch error
			console.log(switchChainError);
			return { success: false, message: 'Oops! Chain could not be switched' };
		}
	}
};
