# 🎭 Playwright Automation - Enterprise Template

Production-ready Playwright test automation with Xray Cloud CI/CD integration.

---

## 📁 What's Inside

```
├── 📚 docs/                              # Architecture standards
│   ├── automation-architecture.md        # System design
│   ├── test-strategy.md                  # Testing approach
│   └── ci-cd-strategy.md                 # Pipeline strategy
│
├── 🎭 playwright-xray-ci-template/      # Ready-to-use template
│   ├── pages/                            # Page Object Model
│   ├── tests/                            # 6 test specs
│   ├── utils/                            # Xray API client
│   ├── .github/workflows/                # GitHub Actions CI/CD
│   └── docs/                             # Setup guides
│
└── 📋 CONTRIBUTING.md                    # Development guidelines
```

---

## ✨ Key Features

✅ **Page Object Model** - 4 page classes with enterprise architecture  
✅ **6 Test Specs** - XRAY-1 to XRAY-6 with Jira traceability  
✅ **Xray Integration** - Automatic bearer token auth & result uploads  
✅ **GitHub Actions** - Auto test execution on push  
✅ **JUnit Reporting** - XML results for CI/CD  
✅ **Environment Variables** - Secure credential management  
✅ **No Static Waits** - Auto-waiting & retry strategy  

---

## 🚀 Quick Start

```bash
cd playwright-xray-ci-template
npm install
npx playwright install --with-deps chromium
cp .env.example .env
npm test
```

---

## 📊 Tests (6 Total)

| XRAY Key | Test | Tag |
|----------|------|-----|
| XRAY-1 | Valid login | @smoke |
| XRAY-2 | Add to cart | @regression |
| XRAY-3 | Invalid login | @regression |
| XRAY-4 | Locked user | @critical |
| XRAY-5 | View cart | @regression |
| XRAY-6 | Remove from cart | @regression |

---

## 🔗 Flow

**Playwright** → **JUnit** → **GitHub Actions** → **Xray** → **Jira**

---

## 📖 Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) - Guidelines
- [docs/automation-architecture.md](docs/automation-architecture.md) - Standards
- [playwright-xray-ci-template/README.md](playwright-xray-ci-template/README.md) - Template details
- [playwright-xray-ci-template/docs/SETUP-GUIDE.md](playwright-xray-ci-template/docs/SETUP-GUIDE.md) - Setup

---

## 🛠️ Stack

Node.js • Playwright • GitHub Actions • Xray Cloud • JUnit
