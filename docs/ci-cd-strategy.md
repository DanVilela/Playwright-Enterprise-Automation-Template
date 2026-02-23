# CI/CD Strategy

## 1. Pipeline Trigger

Pipeline runs:

- On push to main
- On Pull Request

---

## 2. Execution Flow

1. Checkout repository
2. Install dependencies
3. Install Playwright browsers
4. Execute tests
5. Generate results.xml
6. Upload to Xray Cloud

---

## 3. Secrets Management

Secrets must be stored in GitHub:

- XRAY_CLIENT_ID
- XRAY_CLIENT_SECRET

Never store credentials in repository.

---

## 4. Parallelization

Parallel execution enabled by default.

Use:
npx playwright test --workers=4

Adjust based on CI resources.

---

## 5. Failure Policy

If smoke tests fail:
- Pipeline must fail

If regression fails:
- Failure must be visible in Xray
- Jira must reflect execution status

---

## 6. Retry Strategy

- retries = 1
- Avoid increasing retries to hide real issues