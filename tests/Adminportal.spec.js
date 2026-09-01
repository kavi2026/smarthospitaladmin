import { test, expect } from '@playwright/test';

test('Smart Hospital login page demo Admin button fills credentials', async ({ page }) => {
	test.setTimeout(90000);

	await page.goto('https://demo.smart-hospital.in/site/login', { waitUntil: 'domcontentloaded' });

	const adminDemoButton = page.getByRole('button', { name: /^Admin$/ });
	await expect(adminDemoButton).toBeVisible();
	await adminDemoButton.click();

	const emailInput = page.getByRole('textbox', { name: 'Username' });
	const passwordInput = page.getByLabel('Password');

	await expect(emailInput).toHaveValue('jason@gmail.com');
	await expect(passwordInput).toHaveValue('password');

	await page.getByRole('button', { name: 'Sign In' }).click();
	await page.waitForURL(/\/admin\//, { timeout: 45000 });
	await page.waitForTimeout(20000);
	await expect(page).toHaveURL(/\/admin\//);
});
