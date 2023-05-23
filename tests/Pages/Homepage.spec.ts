import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Studio Homepage test', () => {

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Rain Studio/);
  });

  test('sign up button', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL(/sign-in/);
  });

  test('expressions link', async ({ page }) => {
    await page.getByRole('button', { name: 'Discover' }).first().click();
    await expect(page).toHaveURL(/expressions/);
  });

  test('community expressions link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Discover community expressions' }).click();
    await expect(page).toHaveURL(/expressions/);
  });

  test('contracts link', async ({ page }) => {
    await page.getByRole('link', { name: 'Contracts' }).first().click();
    await expect(page).toHaveURL(/contracts/);
  });

  test('docs link', async ({ page }) => {
    await page.getByRole('link', { name: 'Docs' }).first().click();
    await expect(page).toHaveURL(/docs/);

  });

  test('intro docs link', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Learn how to write expressions' }).click();
    await expect(page).toHaveURL(/introduction-to-rain-studio/);
  });

});
