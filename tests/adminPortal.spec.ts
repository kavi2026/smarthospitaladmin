import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import loginData from '../test-data/loginData.json';

const { adminLogin } = loginData;

test.describe('Admin Portal – Smart Hospital Login', () => {
  test('Admin demo button auto-fills credentials and signs in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate(adminLogin.loginPath);

    await expect(loginPage.adminDemoButton).toBeVisible();
    await loginPage.clickAdminDemo();

    await expect(loginPage.usernameInput).toHaveValue(process.env.ADMIN_USERNAME!);
    await expect(loginPage.passwordInput).toHaveValue(process.env.ADMIN_PASSWORD!);

    await loginPage.signIn();

    await page.waitForURL(new RegExp(adminLogin.expectedUrlPattern), { timeout: 45000 });
    await expect(page).toHaveURL(new RegExp(adminLogin.expectedUrlPattern));
  });
});
