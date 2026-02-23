# Automation Architecture

## 1. Objective

This project implements End-to-End automation using Playwright (JavaScript),
integrated with GitHub Actions and Xray Cloud (Jira Cloud) for traceability and reporting.

The architecture follows enterprise-level standards focused on:

- Scalability
- Maintainability
- Traceability
- CI/CD integration
- Test reliability

---

## 2. Technology Stack

- Node.js
- Playwright Test (JavaScript)
- GitHub Actions
- Xray Cloud API
- JUnit Reporter

---

## 3. Project Structure (initial)

- .github/workflows
- /tests
- /pages
- /utils
- /fixtures
- /docs

---

### Responsibilities

- `/tests` → Test specifications (no business logic)
- `/pages` → Page Object Model classes
- `/utils` → Integrations, API clients, helpers
- `/fixtures` → Static test data
- `/docs` → Architecture and strategy documentation

---

## 4. Playwright Configuration Standards

- baseURL must be defined in playwright.config.js
- retries = 1
- Parallel execution enabled
- Screenshots only on failure
- Video only on failure
- JUnit reporter generating results.xml

---

## 5. Page Object Model Rules

- Each page must represent a single UI domain
- No assertions inside page files
- No test logic inside page files
- Selectors must be centralized inside page classes
- Avoid hardcoded waits

---

## 6. Environment Variables

All secrets must use environment variables:

- XRAY_CLIENT_ID
- XRAY_CLIENT_SECRET

No credentials may be hardcoded.

---

## 7. Xray Integration Rules

- Test names must contain Xray Test Key (example: XRAY-1)
- JUnit file must be named: results.xml
- Upload must occur after test execution
- Authentication via Bearer token
- API endpoint:
  https://xray.cloud.getxray.app/api/v2/import/execution/junit

---

## 8. Tagging Strategy

Tests must use tags:

- @smoke
- @regression
- @critical

Example:

test('@smoke XRAY-1 Valid login', async () => {})

---

## 9. Error Handling

- Avoid static waits
- Always rely on Playwright auto-waiting
- Use expect assertions with timeouts
- Fail fast when critical flow breaks