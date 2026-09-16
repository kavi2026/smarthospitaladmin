import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

async function openMedicineExpiryReport(page: import('@playwright/test').Page) {
	const loginPage = new LoginPage(page);

	await loginPage.navigate('https://demo.smart-hospital.in/site/login');
	await loginPage.clickAdminDemo();
	await loginPage.signIn();

	await page.goto('https://demo.smart-hospital.in/admin/multibranch/branch/report', {
		waitUntil: 'domcontentloaded',
	});

	await page.getByRole('link', { name: 'Medicine Expiry Report' }).click();
	await expect(page).toHaveURL('https://demo.smart-hospital.in/admin/multibranch/branch/expmedicinereport');
}

async function selectReportDateRange(page: import('@playwright/test').Page) {
	const fromDate = page.locator('#from_date');
	const datePicker = page.locator('.tempus-dominus-widget:visible');
	await expect(async () => {
		await fromDate.click();
		await expect(datePicker).toBeVisible({ timeout: 1_000 });
	}).toPass({ timeout: 10_000 });

	await datePicker.locator('[data-action="changeCalendarView"]').click();
	await datePicker.locator('[data-action="changeCalendarView"]').click();
	await datePicker.locator('div.previous[data-action="previous"]').click();
	await datePicker.locator('[data-action="selectYear"][data-value="2024"]').click();
	await datePicker.locator('[data-action="selectMonth"][data-value="0"]').click();
	await datePicker.locator('[data-action="selectDay"][data-value="2024-00-01"]').click();

	const toDate = page.locator('#to_date');
	const toDatePicker = page.locator('.tempus-dominus-widget:visible');
	await expect(async () => {
		await toDate.click();
		await expect(toDatePicker).toBeVisible({ timeout: 1_000 });
	}).toPass({ timeout: 10_000 });
	await toDatePicker.locator('[data-action="selectDay"][data-value="2026-08-16"]').click();

	await expect(fromDate).toHaveValue('01/01/2024');
	await expect(toDate).toHaveValue('16/09/2026');
}

test.describe('Branch reports', { tag: '@branch-report' }, () => {
	test.describe('Medicine Expiry Report', { tag: '@medicine-expiry' }, () => {
		test('selects a From Date and To Date', { tag: '@date-picker' }, async ({ page }) => {
			await openMedicineExpiryReport(page);
			await selectReportDateRange(page);
		});

		test('downloads Excel, CSV, PDF, and Print reports', { tag: '@download' }, async ({ page }) => {
			await openMedicineExpiryReport(page);
			await selectReportDateRange(page);

			await page.getByRole('button', { name: ' Search' }).click();
			await expect(page.getByTitle('Excel')).toBeVisible();
			const excelDownload = page.waitForEvent('download');
			await page.getByTitle('Excel').click();
			await excelDownload;
			const csvDownload = page.waitForEvent('download');
			await page.getByTitle('CSV').click();
			await csvDownload;
			const pdfDownload = page.waitForEvent('download');
			await page.getByTitle('PDF').click();
			await pdfDownload;
			await page.getByTitle('Print').click();
			await page.screenshot({
				path: 'tests/screenshot/downloaded-medicine-expiry-reports.png',
				fullPage: true,
			});
		});
	});
});
