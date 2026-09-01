import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly adminDemoButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminDemoButton = page.getByRole('button', { name: /^Admin$/ });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async navigate(loginPath: string): Promise<void> {
    await this.page.goto(loginPath, { waitUntil: 'domcontentloaded' });
  }

  async clickAdminDemo(): Promise<void> {
    await this.adminDemoButton.click();
  }

  async signIn(): Promise<void> {
    await this.signInButton.click();
  }
}
