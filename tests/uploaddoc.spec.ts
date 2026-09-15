import { expect, test } from '@playwright/test';
import * as path from 'path';
import { LoginPage } from '../pages/LoginPage';

test.describe('Upload document', () => {
	test('selects a content type and uploads an Excel file', async ({ page }) => {
		const loginPage = new LoginPage(page);

		await loginPage.navigate('https://demo.smart-hospital.in/site/login');
		await loginPage.clickAdminDemo();
		await loginPage.signIn();

		await page.goto('https://demo.smart-hospital.in/admin/content/upload', {
			waitUntil: 'domcontentloaded',
		});

		await page.getByRole('button', { name: 'Upload' }).click();

		const uploadModal = page.locator('#addModal');
		await expect(uploadModal).toBeVisible();

		await uploadModal.locator('#content_type').selectOption('3');
		await expect(uploadModal.locator('#content_type')).toHaveValue('3');

		const uploadFile = uploadModal.locator('#file');
		const filePath = path.resolve(__dirname, 'upload', 'Test_01.xlsx');
		await uploadFile.setInputFiles(filePath);
		await expect(uploadFile).toHaveValue(/Test_01\.xlsx$/);

		await uploadModal.locator('#load').click();
		await expect(page.getByText('Invalid file content')).toBeVisible();
	});
});
