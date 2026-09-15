import { expect, test } from '@playwright/test';

async function loginAsAdmin(page: import('@playwright/test').Page) {
	await page.goto('https://demo.smart-hospital.in/site/login', { waitUntil: 'domcontentloaded' });
	await page.getByRole('button', { name: /^Admin$/ }).click();
	await expect(page.getByLabel('Username')).toHaveValue(/\S+/);
	await page.getByRole('button', { name: 'Sign In' }).click();
}

test.describe('Pathology Generate Bill', () => {
	test('searches for patient ID 1234 from the patient dropdown', async ({ page }) => {
		await loginAsAdmin(page);

		await page.locator('a[href="https://demo.smart-hospital.in/admin/pathology/gettestreportbatch"]').click();
		await page.waitForURL('**/admin/pathology/gettestreportbatch');

		await page.getByRole('button', { name: /Generate Bill|Générer la facture|Generar factura/ }).click();

		const patientSelector = page.locator('#select2-addpatient_id-container');
		await patientSelector.click();

		const patientSearch = page.locator('.select2-container--open .select2-search__field');
		await patientSearch.fill('1234');

		const patientOptions = page.locator('.select2-results__option');
		await expect(patientOptions).toHaveText(/No results found|\(1234\)$/);
		const patientResult = await patientOptions.textContent();
		expect(patientResult).toMatch(/No results found|\(1234\)$/);

		if (/\(1234\)$/.test(patientResult ?? '')) {
			await patientOptions.click();
			await expect(patientSelector).toHaveText(/\(1234\)$/);
		}
	});

	test('closes the New Patient form when Cancel is clicked', async ({ page }) => {
		await loginAsAdmin(page);

		await page.locator('a[href="https://demo.smart-hospital.in/admin/pathology/gettestreportbatch"]').click();
		await page.waitForURL('**/admin/pathology/gettestreportbatch');

		await page.getByRole('button', { name: /Generate Bill|Générer la facture|Generar factura/ }).click();
		await page.locator('#add').click();

		const patientModal = page.locator('#myModalpa');
		await expect(patientModal).toBeVisible();
		await patientModal.locator('button.btn-outline-secondary[data-bs-dismiss="modal"]').click();
		await expect(patientModal).toBeHidden();
	});

	test('uploads an image for a new patient', async ({ page }) => {
		await loginAsAdmin(page);

		await page.locator('a[href="https://demo.smart-hospital.in/admin/pathology/gettestreportbatch"]').click();
		await page.waitForURL('**/admin/pathology/gettestreportbatch');

		await page.getByRole('button', { name: /Generate Bill|Générer la facture|Generar factura/ }).click();
		await page.locator('#add').click();

		const patientModal = page.locator('#myModalpa');
		const imageUpload = patientModal.locator('#file');
		await imageUpload.setInputFiles('tests/upload/coronavirus-sample-procedure (1).jpg');
		await expect(imageUpload).toHaveValue(/coronavirus-sample-procedure \(1\)\.jpg$/);
	});

	test('captures a screenshot after filling the New Patient form', async ({ page }) => {
		await loginAsAdmin(page);

		await page.locator('a[href="https://demo.smart-hospital.in/admin/pathology/gettestreportbatch"]').click();
		await page.waitForURL('**/admin/pathology/gettestreportbatch');
		await page.getByRole('button', { name: /Generate Bill|Générer la facture|Generar factura/ }).click();
		await page.locator('#add').click();

		const patientModal = page.locator('#myModalpa');
		await expect(patientModal).toBeVisible();

		await patientModal.locator('#name').fill('testkavi patient');
		await patientModal.locator('[name="guardian_name"]').fill('bharathi test');
		await patientModal.locator('#number').fill('987654321');
		await patientModal.locator('#addformgender').selectOption('Female');
		await patientModal.locator('[name="blood_group"]').selectOption({ label: 'A+' });
		await patientModal.locator('#addformemail').fill('abctest@gmail.com');
		await patientModal.locator('[name="address"]').fill('test test test test test');
		await patientModal.locator('#note').fill('test remark');

		await patientModal.screenshot({ path: 'tests/screenshot/filled-new-patient-form.png' });
	});

	test('fills the New Patient form', async ({ page }) => {
		await loginAsAdmin(page);

		await page.locator('a[href="https://demo.smart-hospital.in/admin/pathology/gettestreportbatch"]').click();
		await page.waitForURL('**/admin/pathology/gettestreportbatch');

		await page.getByRole('button', { name: /Generate Bill|Générer la facture|Generar factura/ }).click();
		await page.locator('#add').click();

		const patientModal = page.locator('#myModalpa');
		await expect(patientModal).toBeVisible();

		await patientModal.locator('#name').fill('testkavi patient');
		await patientModal.locator('[name="guardian_name"]').fill('bharathi test');
		await patientModal.locator('#number').fill('987654321');
		await patientModal.locator('#addformgender').selectOption('Female');
		const bloodGroup = patientModal.locator('[name="blood_group"]');
		await bloodGroup.selectOption({ label: 'A+' });
		const maritalStatus = patientModal.locator('[name="marital_status"]');
		const maritalStatusLabel = (await maritalStatus.locator('option').allTextContents()).find((label) =>
			/^(Married|Marié)$/.test(label.trim()),
		);
		expect(maritalStatusLabel).toBeDefined();
		await maritalStatus.selectOption({ label: maritalStatusLabel! });
		const email = patientModal.locator('#addformemail');
		await email.fill('abctest@gmail.com');
		const address = patientModal.locator('[name="address"]');
		await address.fill('test test test test test');
		const identificationNumber = patientModal.locator('[name="identification_number"]');
		await identificationNumber.fill('98761234567');
		const alternateNumber = patientModal.locator('[name="custom_fields[patient][3]"]');
		await alternateNumber.fill('9786754321');
		const remarks = patientModal.locator('#note');
		await remarks.fill('test remark');
		const knownAllergies = patientModal.locator('[name="known_allergies"]');
		await knownAllergies.fill('test allegeries');
		const organisation = patientModal.locator('[name="organisation_id"]');
		await organisation.selectOption({ label: 'Paramount Health Services' });
		const tpaId = patientModal.locator('[name="insurance_id"]');
		await tpaId.fill('TPA123');
		const tpaValidityDate = patientModal.locator('[name="validity"]');
		await tpaValidityDate.click();
		const tpaValidityDatePicker = page.locator('.tempus-dominus-widget.show');
		await tpaValidityDatePicker.locator('[data-action="changeCalendarView"]').click();
		await tpaValidityDatePicker.locator('[data-action="changeCalendarView"]').click();
		await tpaValidityDatePicker.locator('[data-action="selectYear"][data-value="2026"]').click();
		await tpaValidityDatePicker.locator('[data-action="selectMonth"][data-value="8"]').click();
		await tpaValidityDatePicker.locator('[data-action="selectDay"]', { hasText: /^16$/ }).click();
		const birthDate = patientModal.locator('#birth_date');
		await birthDate.click();
		const datePicker = page.locator('.tempus-dominus-widget.show');
		const calendarView = datePicker.locator('[data-action="changeCalendarView"]');
		await calendarView.click();
		await calendarView.click();
		const previousYearRange = datePicker.locator('[data-action="previous"]');
		await previousYearRange.click();
		await previousYearRange.click();
		await previousYearRange.click();
		await previousYearRange.click();
		await datePicker.locator('[data-action="selectYear"][data-value="1990"]').click();
		await datePicker.locator('[data-action="selectMonth"][data-value="3"]').click();
		await datePicker.locator('[data-action="selectDay"]', { hasText: /^24$/ }).click();

		await expect(patientModal.locator('#name')).toHaveValue('testkavi patient');
		await expect(patientModal.locator('[name="guardian_name"]')).toHaveValue('bharathi test');
		await expect(patientModal.locator('#number')).toHaveValue('987654321');
		await expect(patientModal.locator('#addformgender')).toHaveValue('Female');
		await expect(bloodGroup).toHaveValue('2');
		await expect(maritalStatus.locator('option:checked')).toHaveText(/^(Married|Marié)$/);
		await expect(email).toHaveValue('abctest@gmail.com');
		await expect(address).toHaveValue('test test test test test');
		await expect(identificationNumber).toHaveValue('98761234567');
		await expect(alternateNumber).toHaveValue('9786754321');
		await expect(remarks).toHaveValue('test remark');
		await expect(knownAllergies).toHaveValue('test allegeries');
		await expect(organisation).toHaveValue('7');
		await expect(tpaId).toHaveValue('TPA123');
		await expect(tpaValidityDate).toHaveValue('16/09/2026');
		await expect(birthDate).toHaveValue('24/04/1990');
		await expect(patientModal.locator('#age_year')).toHaveValue(/^\d+$/);
		await expect(patientModal.locator('#age_month')).toHaveValue(/^\d+$/);
		await expect(patientModal.locator('#age_day')).toHaveValue(/^\d+$/);
	});
});
