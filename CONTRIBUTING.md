# Contributing Guidelines

## 1. General Rules

- No hardcoded waits (no waitForTimeout)
- No hardcoded credentials
- No business logic inside spec files
- Always use Page Object Model
- Always use environment variables for secrets

---

## 2. Test Naming Convention

Format:

@tag XRAY-KEY Short description

Example:

@smoke XRAY-1 Valid login

---

## 3. Selector Strategy

Preferred order:

1. data-test attribute
2. role-based selectors
3. stable CSS selectors

Avoid:

- Deep CSS chaining
- XPath unless necessary

---

## 4. Pull Request Requirements

Every PR must:

- Pass CI
- Include test coverage for new feature
- Include Xray key in test name

---

## 5. Documentation

Any architectural change must update:

- automation-architecture.md
- test-strategy.md