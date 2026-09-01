import {test,expect} from '@playwright/test';
test('click the Home link', async ({ page }) => {
  await page.goto('https://qaplayground.com/practice/links', { waitUntil: 'domcontentloaded' });
  await page.getByTestId('link-internal-home').click();
  await expect(page).toHaveURL('https://qaplayground.com/');
});