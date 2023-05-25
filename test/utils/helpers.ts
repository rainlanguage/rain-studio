import type { Page, TestInfo } from "@playwright/test";
import assert from 'assert';
import metamask from "@synthetixio/synpress/commands/metamask.js";

/**
 * Function to get the localStorage key value pairs
 * @param page Currently open playwright page
 * @returns Object with key value pair of localStorage items
 */
export async function getLocalStorageItems(page: Page): Promise<{ [key: string]: string }> {
    const localStorageItems = await page.evaluate(() => {
        const localStorageKeys = Object.keys(localStorage);
        const items: { [key: string]: string } = {};

        localStorageKeys.forEach((key) => {
            items[key] = localStorage.getItem(key) || '';
        });

        return items;
    });

    return localStorageItems;
}

/**
 * Compare key value pair
 * @param obj Object to compare
 * @param key expected key 
 * @param value expected value
 */
export function assertKeyValuePair(obj: Record<string, any>, key: string, value: any) {
    assert.deepStrictEqual(obj[key], value, `Expected key '${key}' with value '${value}' not found in the object.`);
}

/**
 * Function to signin to studio using metamask
 * @param page Currently open playwright page
 */
export async function signInUsingMetamask(page: Page) {

    // Navigate to sign-in page
    await page.goto('/sign-in');

    // Click on connect wallet
    await page.getByRole('button', { name: 'Connect Wallet' }).click();

    // Get the web3Modal element
    const web3Modal = await page.$$('.web3modal-provider-wrapper');

    // Select the metamask wallet
    await web3Modal[0]?.click();

    // Connect with metamask
    await metamask.acceptAccess();

    // Assert localStorage
    assertKeyValuePair(await getLocalStorageItems(page), 'WEB3_CONNECT_CACHED_PROVIDER', '"injected"');
}

export async function screenshotOnFailure({ page }: { page: Page }, testInfo: TestInfo) {
    if (testInfo.status !== testInfo.expectedStatus) {
        // Get a unique place for the screenshot.
        const screenshotPath = testInfo.outputPath(`failure.png`);
        // Add it to the report.
        testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' });
        // Take the screenshot itself.
        await page.screenshot({ path: screenshotPath, timeout: 5000 });
    }
}