import { expect, test } from '@playwright/test';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';

test.describe('Pharmacy medicine import', () => {
	test('shows all medicine category options', async ({ page }) => {
		const loginPage = new LoginPage(page);

		await loginPage.navigate('https://demo.smart-hospital.in/site/login');
		await loginPage.clickAdminDemo();
		await loginPage.signIn();

		await page.goto('https://demo.smart-hospital.in/admin/pharmacy/import', {
			waitUntil: 'domcontentloaded',
		});

		const medicineCategoryDropdown = page.locator('#medicine_category_id');
		await expect(medicineCategoryDropdown).toBeVisible();
		await expect(medicineCategoryDropdown.locator('option')).toHaveCount(14);
		await expect(medicineCategoryDropdown.locator('option')).toHaveText([
			'Select',
			'Syrup',
			'Capsule',
			'Injection',
			'Ointment',
			'Cream',
			'Surgical',
			'Drops',
			'Inhalers',
			'Implants / Patches',
			'Liquid',
			'Preparations',
			'Diaper',
			'Tablet',
		]);
		await expect(medicineCategoryDropdown.locator('option').first()).toHaveAttribute('value', '');
	});

	test('uploads the medicine CSV for the Syrup category', async ({ page }) => {
		const loginPage = new LoginPage(page);

		await loginPage.navigate('https://demo.smart-hospital.in/site/login');
		await loginPage.clickAdminDemo();
		await loginPage.signIn();

		await page.goto('https://demo.smart-hospital.in/admin/pharmacy/import', {
			waitUntil: 'domcontentloaded',
		});

		const importForm = page.locator('form[action$="/admin/pharmacy/import"]');
		const sampleFilePath = path.resolve(
			__dirname,
			'upload',
			'import_medicine_sample_file (2).csv',
		);

		await importForm.locator('#medicine_category_id').selectOption({ value: '1' });
		await importForm.locator('#file').setInputFiles(sampleFilePath);
		await expect(importForm.locator('#file')).toHaveValue(/import_medicine_sample_file \(2\)\.csv$/);

		const [response] = await Promise.all([
			page.waitForResponse(
				(response) =>
					response.url().includes('/admin/pharmacy/import') && response.request().method() === 'POST',
			),
			importForm.getByRole('button', { name: 'Import Medicines' }).click(),
		]);

		expect(response.status()).toBe(303);
	});

	test('downloads the medicine sample data file', async ({ page }) => {
		const loginPage = new LoginPage(page);

		await loginPage.navigate('https://demo.smart-hospital.in/site/login');
		await loginPage.clickAdminDemo();
		await loginPage.signIn();

		await page.goto('https://demo.smart-hospital.in/admin/pharmacy/import', {
			waitUntil: 'domcontentloaded',
		});

		const downloadButton = page.getByRole('button', { name: 'Download Sample Data' });
		await expect(downloadButton).toBeEnabled();

		const [download] = await Promise.all([
			page.waitForEvent('download'),
			downloadButton.click(),
		]);

		expect(download.suggestedFilename()).toMatch(/\.csv$/i);
	});
});
