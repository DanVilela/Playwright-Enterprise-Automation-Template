# 🏛️ Architecture Overview

Comprehensive visual guide to the template architecture.

---

## 🔄 Complete Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        PLAYWRIGHT TESTS                         │
│                                                                   │
│  tests/login.spec.js    tests/cart.spec.js                     │
│  (6 total tests with XRAY keys)                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ npm test
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   PAGE OBJECT LAYER                              │
│                                                                   │
│  pages/BasePage.js          pages/LoginPage.js                   │
│  pages/ProductsPage.js      pages/CartPage.js                    │
│                                                                   │
│  (Selectors + Interactions, NO ASSERTIONS)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   PLAYWRIGHT CONFIG                              │
│                                                                   │
│  playwright.config.js                                           │
│  - JUnit Reporter → results.xml                                 │
│  - retries = 1                                                  │
│  - parallel execution                                           │
│  - screenshot/video on failure                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
                        ┌─────────────┐
                        │ results.xml │
                        └──────┬──────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ↓ (Local)             ↓ (CI/CD)
            ┌─────────────────┐   ┌──────────────────┐
            │ npm run         │   │ GitHub Actions   │
            │ xray:upload     │   │ Workflow         │
            └────────┬────────┘   └────────┬─────────┘
                     │                     │
                     └──────────┬──────────┘
                                │
                                ↓
                    ┌─────────────────────────┐
                    │  XRAY CLIENT            │
                    │  (utils/XrayClient.js)  │
                    │                         │
                    │  1. Authenticate        │
                    │     → GET Bearer Token  │
                    │                         │
                    │  2. Upload              │
                    │     → POST results.xml  │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ↓                         ↓
        ┌─────────────────────┐   ┌──────────────────────┐
        │  XRAY CLOUD         │   │  XRAY CLOUD          │
        │                     │   │  API v2              │
        │  Authenticate       │   │  /import/execution   │
        │  Endpoint           │   │  /junit              │
        └──────────┬──────────┘   └──────────┬───────────┘
                   │                         │
                   └────────────┬────────────┘
                                │
                                ↓
                    ┌─────────────────────────┐
                    │   JIRA CLOUD            │
                    │                         │
                    │  ✓ Test Executions     │
                    │  ✓ Pass/Fail Status    │
                    │  ✓ Evidence Attached   │
                    │  ✓ Trends & Metrics    │
                    └─────────────────────────┘
```

---

## 📦 Layered Architecture

### Layer 1: Test Specifications
```
tests/
├── login.spec.js
│   ├── @smoke XRAY-1 Valid login
│   ├── @regression XRAY-3 Invalid login
│   └── @critical XRAY-4 Locked user
└── cart.spec.js
    ├── @regression XRAY-2 Add product
    ├── @regression XRAY-5 View cart
    └── @regression XRAY-6 Remove product

Purpose: Define test scenarios
Rules: 
  - NO assertions in test structure
  - NO page selectors
  - NO hardcoded data
```

### Layer 2: Page Objects
```
pages/
├── BasePage.js (Base class)
│   ├── goto()
│   ├── click()
│   ├── fill()
│   ├── getText()
│   └── waitForElement()
│
├── LoginPage.js
│   ├── Selectors
│   │   ├── usernameInput
│   │   ├── passwordInput
│   │   └── loginButton
│   └── Methods
│       ├── login()
│       ├── getErrorMessage()
│       └── isLoginPageLoaded()
│
├── ProductsPage.js
│   ├── Selectors
│   │   ├── inventoryContainer
│   │   ├── addToCartButton
│   │   └── cartBadge
│   └── Methods
│       ├── addProductToCart()
│       ├── getCartCount()
│       └── goToCart()
│
└── CartPage.js
    ├── Selectors
    │   ├── cartContainer
    │   ├── cartItem
    │   └── checkoutButton
    └── Methods
        ├── getCartItemCount()
        └── proceedToCheckout()

Purpose: Encapsulate page interactions
Rules:
  - One page per domain
  - Centralize selectors
  - NO assertions
  - NO test logic
```

### Layer 3: Test Data
```
fixtures/
└── testData.js
    ├── testUsers
    │   ├── validUser
    │   ├── lockedUser
    │   └── invalidUser
    ├── testProducts
    │   ├── backpackIndex
    │   └── bikeIndex
    ├── expectedMessages
    └── urls

Purpose: Centralize test data
Rules:
  - No magic strings
  - Reusable across tests
```

### Layer 4: Utilities
```
utils/
├── XrayClient.js
│   ├── authenticate()
│   │   └── GET Bearer token
│   └── uploadResults()
│       └── POST JUnit XML
│
└── xray-upload.js
    └── CLI script wrapper

Purpose: External system integration
```

### Layer 5: Configuration
```
playwright.config.js
├── Test execution settings
├── Reporter configuration
├── Timeout settings
├── Parallel execution
└── Failure handling
```

---

## 🔐 Security & Secrets Flow

```
┌─────────────────────────────────────┐
│  XRAY CREDENTIALS                   │
│  - client_id                        │
│  - client_secret                    │
└────────┬────────┬───────────────────┘
         │        │
         ↓        ↓
    ┌─────────┬──────────┐
    │ .env    │ GitHub   │
    │ (Local) │ Secrets  │
    │         │ (CI/CD)  │
    └────┬────┴────┬─────┘
         │         │
         ↓         ↓
    process.env.XRAY_CLIENT_ID
    process.env.XRAY_CLIENT_SECRET
         │
         ↓
    XrayClient.js
         │
         ↓
    Xray Cloud API
         │
         ↓
    Authenticated Request
```

---

## 🚀 CI/CD Pipeline

```
Git Push (main branch)
        │
        ↓
GitHub Actions Triggered
        │
    ┌───┴─────────────────────────┐
    │                             │
    ↓                             ↓
Checkout                    Setup Environment
    │                        ├─ Node 18
    │                        ├─ Install deps
    │                        └─ Install browsers
    │                             │
    └──────────────┬──────────────┘
                   ↓
              Run Tests
              (npm test)
                   │
        ┌──────────┴──────────┐
        ├─ Execute tests      │
        ├─ Generate JUnit XML │
        └─ Capture artifacts  │
                   │
                   ↓
         Upload to Xray
         (npm run xray:upload)
                   │
        ┌──────────┴──────────┐
        ├─ Authenticate       │
        ├─ POST results.xml   │
        └─ Create execution   │
                   │
                   ↓
         Update Jira/Xray
                   │
        ├─ Test Status
        ├─ Pass/Fail Count
        ├─ Execution Evidence
        └─ Trends
```

---

## 🏗️ Selector Hierarchy

```
SauceDemo Application
│
├─ Page 1: Login (/index.html)
│  └─ LoginPage.js
│     ├─ [data-test="username"] ✓ (preferred)
│     ├─ [data-test="password"] ✓ (preferred)
│     ├─ [data-test="login-button"] ✓ (preferred)
│     └─ .login_container (fallback)
│
├─ Page 2: Products (/inventory.html)
│  └─ ProductsPage.js
│     ├─ .inventory_container
│     ├─ .inventory_item
│     ├─ [data-test*="add-to-cart"]
│     └─ .shopping_cart_badge
│
└─ Page 3: Cart (/cart.html)
   └─ CartPage.js
      ├─ .cart_list
      ├─ .cart_item
      └─ [data-test="checkout"]

Selector Priority:
1. data-test attributes (most stable)
2. role-based selectors
3. stable CSS selectors
4. Avoid XPath and deep nesting
```

---

## 📊 Test Categorization

```
All Tests (6 total)
│
├─ SMOKE (@smoke) - 1 test
│  └─ XRAY-1: Valid login
│     Purpose: Validate app is accessible
│     Frequency: Every push
│     Duration: < 3 minutes
│
├─ REGRESSION (@regression) - 4 tests
│  ├─ XRAY-2: Add product to cart
│  ├─ XRAY-3: Invalid login attempts
│  ├─ XRAY-5: View cart and verify item
│  └─ XRAY-6: Remove product from cart
│     Purpose: Validate functionality
│     Frequency: Nightly, PRs
│     Duration: < 10 minutes
│
└─ CRITICAL (@critical) - 1 test
   └─ XRAY-4: Locked user login
      Purpose: Validate security flows
      Frequency: Every push
      Duration: < 3 minutes

Run commands:
$ npm run test:smoke        # Only @smoke
$ npm run test:regression   # Only @regression
$ npm test                  # All tests
```

---

## 🔄 Data Flow Example: Login Test

```
Test: "XRAY-1 Valid login"
│
├─ Setup
│  └─ LoginPage = new LoginPage(page)
│
├─ Arrange (Given)
│  └─ loginPage.navigateToLogin()
│     └─ page.goto('/')
│
├─ Act (When)
│  ├─ Get testData
│  │  └─ { username: 'standard_user', password: 'secret_sauce' }
│  │
│  └─ loginPage.login(username, password)
│     ├─ page.locator(usernameInput).fill(username)
│     ├─ page.locator(passwordInput).fill(password)
│     ├─ page.locator(loginButton).click()
│     └─ page.waitForLoadState('networkidle')
│
└─ Assert (Then)
   ├─ expect(page.url()).toContain('/inventory.html')
   └─ expect(page.locator(inventoryContainer)).toBeVisible()

No selectors in test ✓
No business logic in test ✓
No assertions in page ✓
Clear structure ✓
```

---

## 📈 Traceability Chain

```
Jira Requirement
      ↓
  XRAY Test Case
      ↓
   XRAY-1
      ↓
Test Case Created:
└─ Title: "Valid login"
└─ Key: XRAY-1
└─ Status: Open
      ↓
Playwright Test:
└─ @smoke XRAY-1 Valid login
└─ Executes scenario
└─ Generates evidence
      ↓
JUnit Results:
└─ <testcase name="XRAY-1 Valid login" ... >
└─ (PASS/FAIL)
      ↓
Xray Upload:
└─ POST results.xml
└─ Xray parses "XRAY-1"
└─ Links to test case
      ↓
Jira/Xray Dashboard:
└─ Test execution status updated
└─ Evidence attached
└─ Pass/Fail recorded
└─ Metrics calculated
```

---

## 🎯 Enterprise Standards Met

✅ **Scalability**
- Layer separation
- Reusable components
- Growth-ready structure

✅ **Maintainability**
- Single responsibility
- Clear naming
- Centralized data

✅ **Traceability**
- Jira linkage
- Evidence collection
- Execution history

✅ **Reliability**
- Auto-waiting
- Retry strategy
- Error handling

✅ **Security**
- No hardcoded credentials
- Environment variables
- Secret management

✅ **Automation**
- CI/CD integration
- Automated uploads
- Parallel execution

---

## 🚀 Ready to Scale

This architecture supports:
- ✓ Additional page objects
- ✓ More test scenarios
- ✓ Multiple environments
- ✓ API testing layer
- ✓ Performance testing
- ✓ Contract testing
- ✓ Mobile testing

All without modifying core architecture! 🎉
