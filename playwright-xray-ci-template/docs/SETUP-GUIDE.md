# Setup Guide - Playwright Xray CI Template

Complete step-by-step setup instructions for developers and CI/CD teams.

---

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Git** for version control
- **GitHub Account** (for CI/CD)
- **Xray Cloud Account** (for test reporting)
- **Jira Cloud Account** (for test case management)

---

## 🚀 Getting Started (5 minutes)

### 1. Clone Repository

```bash
git clone <repository-url>
cd playwright-xray-ci-template
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `@playwright/test` - Test framework
- `axios` - HTTP client (for Xray API)
- `dotenv` - Environment variable loader

### 3. Install Playwright Browsers

```bash
npx playwright install --with-deps chromium
```

### 4. Create .env File

```bash
cp .env.example .env
```

### 5. Run Tests Locally

```bash
npm test
```

Expected output:
```
✓ Authentication › Valid login ✓
✓ Shopping Cart › Add product to cart
✓ ...

6 passed (1m 30s)
```

---

## 🔐 Xray Cloud Setup (10 minutes)

### Step 1: Create Xray API Client

1. **Login to Xray Cloud**
   - https://xray.cloud.getxray.app

2. **Navigate to API Clients**
   - Click ⚙️ Settings (top-right)
   - Select "Organization Settings"
   - Click "API Clients" in left menu

3. **Create New API Client**
   - Click "Create API Client"
   - Name: `playwright-automation`
   - Permissions:
     - ✅ Execute Tests
     - ✅ Search Test Executions

4. **Copy Credentials**
   - Copy `Client ID`
   - Copy `Client Secret`

### Step 2: Update .env File

Edit `.env`:

```env
XRAY_CLIENT_ID=xxxxx_your_client_id_xxxxx
XRAY_CLIENT_SECRET=xxxxx_your_client_secret_xxxxx
BASE_URL=https://www.saucedemo.com
NODE_ENV=test
```

### Step 3: Test Connection

```bash
npm run xray:upload
```

Expected output:
```
✅ Xray authentication successful
📤 Uploading results...
✅ Results uploaded successfully to Xray
```

---

## 🏗️ Create Test Cases in Jira

### Step 1: Navigate to Project

1. Open Jira Cloud
2. Select your project
3. Click "Create" button

### Step 2: Create Test Cases

Create 6 issues with type "Test":

| Key | Title | Description |
|-----|-------|-------------|
| XRAY-1 | Valid login | User can login with valid credentials |
| XRAY-2 | Add product to cart | User can add product to shopping cart |
| XRAY-3 | Invalid login attempts | System shows error for invalid credentials |
| XRAY-4 | Locked user login | System blocks locked user account |
| XRAY-5 | View cart and verify item | User can view added items in cart |
| XRAY-6 | Remove product from cart | User can remove items from cart |

### Step 3: Link to Xray

For each issue:
1. Click on issue
2. In right panel, find "Xray"
3. Click "Link Xray Test"
4. Select Test Case
5. Save

---

## 🔧 GitHub Setup for CI/CD (10 minutes)

### Step 1: Create GitHub Secrets

1. **Open GitHub Repository**
   - Settings → Secrets and variables → Actions

2. **Create Secret: XRAY_CLIENT_ID**
   - Name: `XRAY_CLIENT_ID`
   - Value: `(paste your client ID)`
   - Click "Add secret"

3. **Create Secret: XRAY_CLIENT_SECRET**
   - Name: `XRAY_CLIENT_SECRET`
   - Value: `(paste your client secret)`
   - Click "Add secret"

### Step 2: Enable Actions

- Go to "Actions" tab
- Enable "GitHub Actions"

### Step 3: Test Workflow

1. Make a commit:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. Navigate to "Actions" tab
3. See workflow running
4. Wait for completion

Expected workflow:
- ✅ Install Node
- ✅ Install Playwright
- ✅ Run tests
- ✅ Upload to Xray
- ✅ Comment on PR

---

## 🧪 Local Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run only smoke tests
npm run test:smoke

# Run only regression tests
npm run test:regression

# Run in debug mode (interactive browser)
npm run test:debug

# Run in UI mode (visual interface)
npm run test:ui

# View HTML report
npm run test:report
```

### Adding New Tests

1. **Create test file** in `/tests`:
   ```javascript
   // tests/my-feature.spec.js
   import { test, expect } from '@playwright/test';
   import { MyPage } from '../pages/MyPage.js';
   
   test('@regression XRAY-7 My new test', async ({ page }) => {
     const myPage = new MyPage(page);
     // Test implementation
   });
   ```

2. **Create Page Object** in `/pages`:
   ```javascript
   // pages/MyPage.js
   import { BasePage } from './BasePage.js';
   
   export class MyPage extends BasePage {
     mySelector = '[data-test="my-element"]';
     
     async myMethod() {
       // Implementation
     }
   }
   ```

3. **Create test case in Jira** with key `XRAY-7`

4. **Run test**:
   ```bash
   npm test
   ```

5. **Upload to Xray**:
   ```bash
   npm run xray:upload
   ```

---

## 📁 File Structure Overview

```
playwright-xray-ci-template/
├── .github/workflows/
│   └── playwright-tests.yml        # ← CI/CD pipeline
├── pages/
│   ├── BasePage.js                 # ← Base class
│   ├── LoginPage.js                # ← Login page
│   ├── ProductsPage.js             # ← Products page
│   └── CartPage.js                 # ← Cart page
├── tests/
│   ├── login.spec.js               # ← Login tests (XRAY-1, XRAY-3, XRAY-4)
│   └── cart.spec.js                # ← Cart tests (XRAY-2, XRAY-5, XRAY-6)
├── utils/
│   ├── XrayClient.js               # ← Xray API client
│   └── xray-upload.js              # ← Upload script
├── fixtures/
│   └── testData.js                 # ← Test data
├── docs/
│   └── XRAY-INTEGRATION.md         # ← Xray guide
├── .env.example                    # ← Environment variables template
├── .gitignore                      # ← Git ignore rules
├── package.json                    # ← Dependencies
├── playwright.config.js            # ← Playwright config
└── README.md                       # ← Project documentation
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `npm install` completes without errors
- [ ] `npx playwright install` installs browsers
- [ ] `.env` file created with your credentials
- [ ] `npm test` runs without errors
- [ ] `npm run xray:upload` connects successfully
- [ ] Results appear in Xray Cloud
- [ ] GitHub Secrets configured
- [ ] Workflow runs on push to main
- [ ] PR gets commented with test results
- [ ] Jira test cases show execution status

---

## 🚨 Common Issues & Solutions

### Issue: "Module not found: @playwright/test"

**Solution:**
```bash
npm install
npx playwright install --with-deps chromium
```

### Issue: ".env file not found"

**Solution:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

### Issue: "Xray authentication failed"

**Solution:**
1. Verify credentials in `.env`
2. Check credentials aren't using quotes
3. Regenerate API Client in Xray Cloud

### Issue: "results.xml not found"

**Solution:**
```bash
# Run tests first
npm test

# Then upload
npm run xray:upload
```

### Issue: "GitHub workflow not running"

**Solution:**
1. Go to Actions tab
2. Enable GitHub Actions
3. Check `.github/workflows/playwright-tests.yml` exists
4. Push to main branch

### Issue: "Tests timing out"

**Solution:**
1. Increase timeout in `playwright.config.js`:
   ```javascript
   timeout: 60 * 1000, // 60 seconds
   ```

2. Check network connectivity:
   ```bash
   ping www.saucedemo.com
   ```

---

## 📚 Next Steps

1. ✅ Complete initial setup
2. ✅ Configure Xray credentials
3. ✅ Create test cases in Jira
4. ✅ Run tests locally
5. ✅ Upload to Xray
6. ✅ Push to GitHub for CI/CD
7. 📖 Read [README.md](../README.md) for detailed architecture
8. 📖 Read [XRAY-INTEGRATION.md](./XRAY-INTEGRATION.md) for API details

---

## 🤝 Getting Help

**Documentation:**
- [Playwright Docs](https://playwright.dev/)
- [Xray Cloud Docs](https://docs.getxray.app/)
- [GitHub Actions Docs](https://docs.github.com/actions)

**Check Logs:**
```bash
# View test failures
npm run test:report

# Check Xray upload logs
npm run xray:upload
```

**Test Manually:**
```bash
# Run single test file
npx playwright test tests/login.spec.js

# Run with specific tag
npx playwright test --grep @smoke
```

---

## 🎉 Success!

You're all set! 

Start by running:
```bash
npm test
```

Then push to GitHub to see the full CI/CD pipeline in action! 🚀
