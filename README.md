# Playwright TypeScript Automation Framework

A Playwright end-to-end test automation project using **TypeScript**, following the **Page Object Model (POM)** design pattern.

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation & test runner |
| TypeScript | Strongly-typed test code |
| dotenv | Manage credentials via `.env` |
| JSON test data | Externalize test inputs |
| HTML Reporter | Visual test reports |

---

## Project Structure

```
playwright-ts-pom/
├── pages/
│   └── LoginPage.ts          # Page Object for the login page
├── tests/
│   └── adminPortal.spec.ts   # TypeScript test spec
├── test-data/
│   └── loginData.json        # Externalised test data
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript compiler options
├── .env                      # Local credentials (git-ignored)
├── .env.example              # Template for .env
├── .gitignore
├── package.json
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+
- Git

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies

```bash
npm install
npx playwright install
```

### 3. Configure environment variables

Copy the example file and fill in credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
BASE_URL=https://demo.smart-hospital.in
ADMIN_USERNAME=jason@gmail.com
ADMIN_PASSWORD=password
```

> **Note:** `.env` is git-ignored and should never be committed.

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all TypeScript specs on all browsers |
| `npm run test:chromium` | Run on Chromium only |
| `npm run test:firefox` | Run on Firefox only |
| `npm run test:headed` | Run in headed (visible browser) mode |
| `npm run report` | Open the last HTML report |

---

## HTML Report

An HTML report is generated automatically after each run inside `playwright-report/`. Open it with:

```bash
npm run report
```

---

## Screenshots on Failure

Screenshots are captured automatically for any failing test and saved inside `test-results/`. No manual configuration needed — this is enabled via `screenshot: 'only-on-failure'` in `playwright.config.ts`.

---

## Page Object Model

Each page is represented by a class in `pages/`. Tests import the page class, instantiate it with `page`, and call its methods — keeping test logic separate from DOM selectors.

```typescript
const loginPage = new LoginPage(page);
await loginPage.navigate(loginData.adminLogin.loginPath);
await loginPage.clickAdminDemo();
await loginPage.signIn();
```

---

## Test Data

Test data is stored in `test-data/loginData.json` and imported directly into specs. Credentials are kept in `.env`, not in JSON.

---

## Git Workflow

```bash
git init
git add .
git commit -m "Initial commit: Playwright TS POM framework"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

---

## License

ISC
