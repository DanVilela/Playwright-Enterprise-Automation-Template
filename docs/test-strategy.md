# Test Strategy

## 1. Testing Pyramid

This project focuses on E2E layer.

Future improvements may include:

- API tests
- Contract tests
- Component tests

---

## 2. E2E Scope

Covered flows:

- Login
- Add product to cart
- Checkout flow

Not covered:

- Internal API contract validation
- Performance tests
- Security tests

---

## 3. Smoke Suite

Smoke tests must validate:

- Application availability
- Login functionality
- Core business flow

Smoke tests must execute in under 3 minutes.

---

## 4. Regression Suite

Regression includes:

- Positive scenarios
- Negative scenarios
- Validation flows

Executed on:
- Pull Requests
- Nightly builds

---

## 5. Traceability

Each test must:

- Contain Xray Test Key in title
- Be mapped to Jira Requirement
- Generate execution evidence

---

## 6. Flaky Test Strategy

If a test fails intermittently:

1. Validate selector stability
2. Validate async behavior
3. Validate network stability
4. Mark temporarily as @quarantine if needed