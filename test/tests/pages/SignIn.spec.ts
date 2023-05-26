import { test, expect } from "../../fixtures/test.fixtures";
import metamask from "@synthetixio/synpress/commands/metamask.js";
import playwright from "@synthetixio/synpress/commands/playwright.js";

import { assertKeyValuePair, getLocalStorageItems, screenshotOnFailure } from "../../utils/helpers";

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.afterEach(screenshotOnFailure);

test.describe('Studio Sign In Page test', () => {

  test('connect wallet using metamask', async ({ page }) => {
    // Navigate to sign-in page
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL(/sign-in/);

    // Click on connect wallet
    await page.getByRole('button', { name: 'Connect Wallet' }).click();

    // Assert available providers
    await expect(page.getByText('Metamask')).toBeVisible();
    await expect(page.getByText('Connect with the provider in your Browser')).toBeVisible();
    await expect(page.getByText('WalletConnect').first()).toBeVisible();
    await expect(page.getByText('Scan with WalletConnect to connect')).toBeVisible();

    // Get the web3Modal element
    const web3Modal = await page.$$('.web3modal-provider-wrapper');

    // Select the metamask wallet
    await web3Modal[0]?.click();
    setTimeout(() => {
      console.log('hello');
    }, 5000);

    // Connect with metamask
    const pages = await playwright.browser().contexts()[0].pages();
    for (const page of pages) {
      console.log("========================= PAGE URL = \n");
      console.log(page.url());
    }
    // console.log(brow);
    await metamask.acceptAccess();

    // Assert localStorage
    assertKeyValuePair(await getLocalStorageItems(page), 'WEB3_CONNECT_CACHED_PROVIDER', '"injected"');
  });

});
