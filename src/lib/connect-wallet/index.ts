import Web3Modal from 'web3modal';
import { defaultEvmStores } from 'svelte-ethers-store';
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min';
import { changeNetwork } from './handleNetwork';
import { ethers } from 'ethers';

const providerOptions = {
	injected: {
		display: {
			name: 'Metamask',
			description: 'Connect with the provider in your Browser'
		},
		package: null
	},
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			infuraId: '0f270373e0934beda174c537257386b0'
		}
	}
};

export const connectWallet = async () => {
	const web3Modal = new Web3Modal({
		cacheProvider: true,
		providerOptions,
		network: 'any'
	});
	const _provider = await web3Modal.connect();

	defaultEvmStores.setProvider(_provider);
};

export const disconectWallet = async () => {
	defaultEvmStores.disconnect();
};

export { changeNetwork };
