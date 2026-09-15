import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Holiday calendar', () => {
	test('creates a holiday shown on the front site', async ({ page }) => {
		const loginPage = new LoginPage(page);

		await loginPage.navigate('https://demo.smart-hospital.in/site/login');
		await loginPage.clickAdminDemo();
		await loginPage.signIn();

		await page.goto('https://demo.smart-hospital.in/admin/holiday/index', {
			waitUntil: 'domcontentloaded',
		});

		const holidayDialog = page.getByRole('dialog');
		const holidayType = holidayDialog.locator('#radio_1');
		const holidayDate = holidayDialog.locator('#from_date');
		const description = holidayDialog.locator('#description');
		const frontSiteSwitch = holidayDialog.locator('#front_site');

		await page.locator("button[title='Add']").click();
		await expect(holidayDialog).toBeVisible();
		await holidayType.locator('xpath=..').click();
		await expect(holidayDate).toBeVisible();

		await holidayDate.fill('16/09/2026');
		await description.fill('testkaviholiday');
		await frontSiteSwitch.evaluate((checkbox) => checkbox.click());
		await expect(frontSiteSwitch).toBeChecked();

		await holidayDialog.getByRole('button', { name: 'Save' }).click();
		await expect(holidayDialog).toBeHidden();
	});

	test('captures a screenshot after holiday details are saved successfully', async ({ page }) => {
		const loginPage = new LoginPage(page);
		const holidayDescription = `testkavi holiday ${Date.now()}`;

		await loginPage.navigate('https://demo.smart-hospital.in/site/login');
		await loginPage.clickAdminDemo();
		await loginPage.signIn();

		await page.goto('https://demo.smart-hospital.in/admin/holiday/index', {
			waitUntil: 'domcontentloaded',
		});

		const holidayDialog = page.getByRole('dialog');
		const holidayType = holidayDialog.locator('#radio_1');
		const holidayDate = holidayDialog.locator('#from_date');
		const description = holidayDialog.locator('#description');

		await page.locator("button[title='Add']").click();
		await expect(holidayDialog).toBeVisible();
		await holidayType.locator('xpath=..').click();
		await holidayDate.fill('17/09/2026');
		await description.fill(holidayDescription);

		await holidayDialog.getByRole('button', { name: 'Save' }).click();
		await expect(holidayDialog).toBeHidden();
		await expect(page.getByText(holidayDescription)).toBeVisible();
		await page.screenshot({ path: 'tests/screenshot/saved-holiday-details.png', fullPage: true });
	});
});
