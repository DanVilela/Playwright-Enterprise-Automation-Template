# 🎭 Playwright Xray CI Template

A production-ready Playwright enterprise automation template with Xray Cloud integration, demonstrating CI/CD best practices, test traceability, and enterprise automation architecture.

---

## 🎯 Overview

This project is **NOT** focused on testing the application itself, but rather:

✅ **CI/CD Integration** - GitHub Actions pipeline with automated test execution
✅ **Test Traceability** - Xray Cloud integration with Jira for test management  
✅ **Enterprise Architecture** - Page Object Model, separation of concerns, scalability
✅ **Production-Ready** - Follows industry standards and best practices
✅ **Automated Reporting** - JUnit XML results uploaded to Xray

---

## 📋 Tech Stack

- **Node.js** - JavaScript runtime
- **Playwright Test** - Modern web automation framework
- **GitHub Actions** - CI/CD orchestration
- **Xray Cloud API** - Test management and reporting
- **JUnit Reporter** - XML test results format

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- GitHub account (for CI/CD)
- Xray Cloud account (for test reporting)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd playwright-xray-ci-template

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium
```

### Configuration

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Get Xray credentials:**
   - Go to Xray Cloud → Settings → API Clients
   - Create new API Client
   - Copy `client_id` and `client_secret`

3. **Update .env file:**
   ```env
   XRAY_CLIENT_ID=your_client_id
   XRAY_CLIENT_SECRET=your_client_secret
   BASE_URL=https://www.saucedemo.com
   ```

4. **Setup GitHub Secrets (for CI/CD):**
   - Navigate to GitHub repository → Settings → Secrets and variables → Actions
   - Add `XRAY_CLIENT_ID`
   - Add `XRAY_CLIENT_SECRET`

---

## 🧪 Running Tests

### Local Execution

```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run regression tests only
npm run test:regression

# Run tests in debug mode
npm run test:debug

# Run tests in UI mode (interactive)
npm run test:ui

# View HTML report
npm run test:report
```

### CI/CD Execution

Tests automatically run on:
- Push to `main` or `develop` branches
- All pull requests

---

## 📤 Xray Integration

### Manual Upload to Xray

```bash
# Upload test results to Xray Cloud
npm run xray:upload
```

### Automated Upload (GitHub Actions)

The GitHub Actions workflow automatically:
1. ✅ Runs tests
2. ✅ Generates `results.xml` (JUnit format)
3. ✅ Authenticates with Xray Cloud
4. ✅ Uploads results for traceability
5. ✅ Comments on PR with results

---

## 🏗️ Project Structure

```
playwright-xray-ci-template/
├── .github/
│   └── workflows/
│       └── playwright-tests.yml     # GitHub Actions workflow
├── pages/                           # Page Objects
│   ├── BasePage.js                  # Base class with common methods
│   ├── LoginPage.js                 # Login page object
│   ├── ProductsPage.js              # Products page object
│   └── CartPage.js                  # Cart page object
├── tests/                           # Test specifications
│   ├── login.spec.js                # Authentication tests (XRAY-1, XRAY-3, XRAY-4)
│   └── cart.spec.js                 # Shopping cart tests (XRAY-2, XRAY-5, XRAY-6)
├── utils/                           # Utilities and integrations
│   ├── XrayClient.js                # Xray Cloud API client
│   └── xray-upload.js               # Upload script
├── fixtures/                        # Static test data
│   └── testData.js                  # Test users and constants
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies and scripts
└── playwright.config.js             # Playwright configuration
```

---

## 🏛️ Architecture Principles

### Page Object Model (POM)

✅ Each page encapsulates:
- UI selectors (data-test attributes, role-based selectors)
- Page navigation methods
- Element interaction methods

❌ Page Objects do NOT contain:
- Assertions
- Test logic
- Business logic

Example:
```javascript
// ✅ GOOD - Page Object
async login(username, password) {
  await this.fill(this.usernameInput, username);
  await this.fill(this.passwordInput, password);
  await this.click(this.loginButton);
}

// ❌ BAD - Assertion in Page Object
async login(username, password) {
  await this.fill(this.usernameInput, username);
  expect(this.page.url()).toContain('/inventory');
}
```

### Test Specification Standards

✅ Test specs contain:
- Clear Given-When-Then structure
- Assertions using Playwright `expect()`
- Page Object interactions

❌ Test specs do NOT contain:
- Business logic
- Hard-coded selectors
- Static waits

Example:
```javascript
test('@smoke XRAY-1 Valid login', async ({ page }) => {
  // Given
  await expect(loginPage.page.locator(loginPage.loginContainer)).toBeVisible();
  
  // When
  await loginPage.login(username, password);
  
  // Then
  await expect(productsPage.page.url()).toContain('/inventory.html');
});
```

### Environment & Secrets

✅ Use environment variables:
```javascript
const clientId = process.env.XRAY_CLIENT_ID;
const baseUrl = process.env.BASE_URL;
```

❌ Never hardcode credentials:
```javascript
// ❌ WRONG
const clientId = 'abc123def456';
```

### Wait Strategy

✅ Use Playwright auto-waiting:
```javascript
await page.click(button); // Auto-waits for element to be actionable
```

❌ Never use static waits:
```javascript
// ❌ WRONG
await page.waitForTimeout(5000);
```

---

## 📊 Test Execution & Reporting

### Test Tagging

Tests are categorized using tags:

| Tag | Purpose | Frequency |
|-----|---------|-----------|
| `@smoke` | Quick smoke tests (~3 min) | On every push |
| `@regression` | Full regression suite | Nightly, PRs |
| `@critical` | Critical business flows | Always |

### Xray Test Keys

Every test must include an Xray Test Key for traceability:

```javascript
test('@smoke XRAY-1 Valid login', async () => { })
test('@regression XRAY-2 Add product to cart', async () => { })
```

This maps to:
- Test case `XRAY-1` in Jira
- Execution evidence in Xray
- Pull request reports

### JUnit Results

Playwright generates `results.xml`:
- Created by JUnit reporter
- Contains: Test names, durations, failures, stack traces
- Uploaded to Xray Cloud for reporting
- Viewable in Jira

---

## 🔗 Integration Flow

```
Playwright Tests
       ↓
  Test Execution
       ↓
JUnit Reporter (results.xml)
       ↓
GitHub Actions Workflow
       ↓
Xray Cloud API
  [Authenticate + Upload]
       ↓
Jira / Xray
  [Test Results & Traceability]
       ↓
Project Dashboard
  [Test Status, Metrics, Trends]
```

---

## 🔐 Security

### Secrets Management

Never commit:
- `.env` files with real credentials
- Client IDs or secrets
- API keys

Store in:
- GitHub Secrets (for CI/CD)
- Local `.env` (never commit)
- Secret management services (production)

### GitHub Secrets Setup

```
GitHub → Repository → Settings → Secrets and variables → Actions
Add secrets:
  - XRAY_CLIENT_ID
  - XRAY_CLIENT_SECRET
```

---

## 📈 Performance Considerations

### Parallel Execution

Tests run in parallel (4 workers locally, 1 worker in CI):

```bash
# Run with custom worker count
npx playwright test --workers=8
```

### Retry Strategy

- `retries = 1` (defined in playwright.config.js)
- Catches flaky tests without hiding real failures
- Do NOT increase retries to mask issues

### Timeouts

- **Test timeout:** 30 seconds
- **Expect timeout:** 5 seconds
- **Action timeout:** 5 seconds
- **Navigation timeout:** 30 seconds

---

## 🐛 Troubleshooting

### Xray Upload Fails

```bash
# Check credentials
echo $XRAY_CLIENT_ID
echo $XRAY_CLIENT_SECRET

# Verify results.xml exists
ls -la results.xml

# Run upload with verbose logging
node utils/xray-upload.js
```

### Tests Timeout

1. Increase timeout in `playwright.config.js`:
   ```javascript
   timeout: 60 * 1000, // 60 seconds
   ```

2. Check for:
   - Network issues
   - Slow selectors
   - Missing auto-wait conditions

### Browser Installation Issues

```bash
# Reinstall browsers
npx playwright install --with-deps chromium

# Check installation
npx playwright install-deps
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Xray Cloud API](https://docs.getxray.app/display/XRAY/Xray+Cloud+API)
- [JUnit Format](https://github.com/junit-team/junit5/wiki/JUnit-5-User-Guide)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 📝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Code style guidelines
- Test naming conventions
- PR requirements
- Architecture standards

---

## 📄 License

MIT License - See LICENSE file for details

---

## ✨ Key Features

✅ **Enterprise-Ready** - Production-level automation architecture
✅ **CI/CD Integrated** - GitHub Actions with secure credential management
✅ **Fully Traceable** - Xray Cloud integration with Jira
✅ **Scalable** - Page Object Model supporting growth
✅ **Well-Documented** - Clear architecture and examples
✅ **Best Practices** - No hardcoded values, separation of concerns
✅ **Maintainable** - Clean code, consistent patterns
✅ **Extensible** - Ready for multi-environment and API testing

---

## 🚀 Next Steps

1. Clone the repository
2. Install dependencies (`npm install`)
3. Configure Xray credentials
4. Run tests locally (`npm test`)
5. Push to GitHub to trigger CI/CD
6. View results in Jira/Xray

Happy testing! 🎭
