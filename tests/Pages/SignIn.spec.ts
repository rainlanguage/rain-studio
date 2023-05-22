import { expect } from "@playwright/test";
import { test } from "../utils/fixtures";
import { assertKeyValuePair, getLocalStorageItems } from "../utils/helpers";

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Studio Sign In Page test', () => {

  test('connect wallet using metamask', async ({ wallet, page }) => {
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

    // Connect with metamask
    await wallet.approve();

    // Assert localStorage
    assertKeyValuePair(await getLocalStorageItems(page), 'WEB3_CONNECT_CACHED_PROVIDER', '"injected"');
  });

});
