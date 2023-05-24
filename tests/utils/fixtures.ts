import { type BrowserContext, test as baseTest } from "@playwright/test";
import dappwright, { type Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";

let sharedContext: BrowserContext;

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({ }, use) => {
    // Launch context with extension
    if (!sharedContext) {
      const [wallet, _, context] = await dappwright.bootstrap("", {
        wallet: "metamask",
        version: MetaMaskWallet.recommendedVersion,
        seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
        headless: true,
      });

      // Add Hardhat as a custom network
      await wallet.addNetwork({
        networkName: "Hardhat",
        rpc: "http://127.0.0.1:8545",
        chainId: 31337,
        symbol: "ETH",
      });

      sharedContext = context;
    }

    await use(sharedContext);
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet("metamask", context);

    await use(metamask);
  },
});
