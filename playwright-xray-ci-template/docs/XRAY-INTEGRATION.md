# Xray Cloud Integration Guide

This document explains how this project integrates with Xray Cloud for test management and reporting.

---

## 🎯 Integration Overview

This project automatically:
1. Executes tests using Playwright
2. Generates JUnit XML results
3. Authenticates with Xray Cloud
4. Uploads results to link with Jira Test Cases
5. Creates execution evidence for traceability

---

## 🔐 Xray Cloud Authentication

### Bearer Token Authentication

The integration uses **Client Credentials Flow**:

```
1. POST /authenticate
   ├─ client_id
   └─ client_secret
        ↓
   Returns: Bearer Token
        ↓
2. POST /import/execution/junit
   ├─ Authorization: Bearer {token}
   └─ Body: results.xml
```

### Getting Xray Credentials

1. **Login to Xray Cloud**
   - Go to: https://xray.cloud.getxray.app

2. **Navigate to API Clients**
   - Settings → Organization Settings → API Clients

3. **Create API Client**
   - Click "Create API Client"
   - Name: `playwright-automation`
   - Permissions: `Execute Tests`, `Search Test Executions`

4. **Copy Credentials**
   - `client_id` (copy to XRAY_CLIENT_ID)
   - `client_secret` (copy to XRAY_CLIENT_SECRET)

---

## 📋 Xray Test Keys & Jira Issues

### Creating Test Cases in Jira

Before running tests, create corresponding Jira issues:

**Example:**

| Test Case | Jira Issue | Title | Status |
|-----------|-----------|-------|--------|
| XRAY-1 | XRAY-1 | Valid login | ✅ |
| XRAY-2 | XRAY-2 | Add product to cart | ✅ |
| XRAY-3 | XRAY-3 | Invalid login attempts | ✅ |

### Test Name Format

Every test must follow this pattern:

```
@tag XRAY-{number} Description
```

Examples:
```javascript
test('@smoke XRAY-1 Valid login', ...)
test('@regression XRAY-2 Add product to cart', ...)
test('@critical XRAY-4 Locked user login', ...)
```

The parser extracts `XRAY-{number}` to link with Jira.

---

## 🚀 JUnit Results Format

### Generated results.xml

Structure:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="Playwright Tests" tests="6" failures="0" skipped="0">
  <testsuite name="Authentication" tests="3" failures="0">
    <testcase name="XRAY-1 Valid login" classname="Authentication" time="2.345" />
    <testcase name="XRAY-3 Invalid login attempts" classname="Authentication" time="1.234">
      <failure message="Assertion failed">...</failure>
    </testcase>
    ...
  </testsuite>
</testsuites>
```

### Xray Parsing

Xray Cloud API:
1. Reads `<testcase name>` attribute
2. ✅ Extracts test key `XRAY-{number}`
3. Matches with Jira test case
4. Creates test execution
5. Links execution to test case

---

## 📤 Upload API Endpoint

### Endpoint Details

```
POST https://xray.cloud.getxray.app/api/v2/import/execution/junit
```

### Request Headers

```
Authorization: Bearer {access_token}
Content-Type: application/xml
```

### Request Body

- JUnit XML file content as string

### Response

```json
{
  "id": "12345",
  "key": "XRAY-1",
  "selfUrl": "https://xray.cloud.getxray.app/api/v2/execution/12345"
}
```

---

## 🔄 CI/CD Integration Flow

### GitHub Actions Workflow

```yaml
on: [push, pull_request]

jobs:
  test:
    steps:
      1. Checkout
      2. Setup Node
      3. Install dependencies
      4. Install browsers
      5. Run tests → results.xml
      6. Upload to Xray
         ├─ Authenticate (client_id + secret)
         ├─ Get Bearer token
         └─ POST results.xml
      7. Comment PR with status
```

### Environment Variables

**For Local Testing:**
```bash
# In .env file
XRAY_CLIENT_ID=your_id
XRAY_CLIENT_SECRET=your_secret
BASE_URL=https://www.saucedemo.com
```

**For GitHub Actions:**
```yaml
# In GitHub Secrets
XRAY_CLIENT_ID
XRAY_CLIENT_SECRET
```

---

## 🧪 Testing the Integration Locally

### Step 1: Run Tests

```bash
npm test
```

Creates `results.xml`

### Step 2: Upload Manually

```bash
npm run xray:upload
```

### Expected Output

```
🔐 Authenticating with Xray Cloud...
✅ Xray authentication successful
📤 Uploading results from ./results.xml...
✅ Results uploaded successfully to Xray
Execution ID: 67890
```

---

## 🔍 Verification in Jira

### After Upload:

1. **Open Jira Project**
   - Navigate to project containing test cases

2. **View Test Case**
   - Click on `XRAY-1`
   - Scroll to "Test Executions"
   - See latest execution with results

3. **View Test Execution**
   - Click execution ID
   - See:
     - Test status (PASS/FAIL)
     - Screenshots/videos (if available)
     - Execution duration
     - Error details (if failed)

---

## 🛠️ Implementation Details

### XrayClient Class

Located in: `utils/XrayClient.js`

**Key Methods:**
- `authenticate()` - Gets Bearer token
- `uploadResults(filePath)` - Uploads JUnit XML

**Usage:**
```javascript
import { XrayClient } from './utils/XrayClient.js';

const xray = new XrayClient();
await xray.uploadResults('./results.xml');
```

### Upload Script

Located in: `utils/xray-upload.js`

**Usage:**
```bash
node utils/xray-upload.js
```

**Functionality:**
- Checks if `results.xml` exists
- Initializes XrayClient
- Uploads results
- Handles errors gracefully

---

## 🚨 Troubleshooting

### Error: "XRAY_CLIENT_ID not defined"

**Solution:**
- Check `.env` file exists
- Verify environment variables are set
- In GitHub: Check Secrets are configured

```bash
echo $XRAY_CLIENT_ID  # Should print your ID
```

### Error: "results.xml not found"

**Solution:**
- Ensure tests ran successfully
- Check `results.xml` is in project root
- Run tests first: `npm test`

```bash
ls -la results.xml  # Verify file exists
```

### Error: "Authentication failed"

**Solution:**
- Verify Xray credentials are correct
- Check credentials in `.env` or GitHub Secrets
- Regenerate API Client in Xray if needed

### Error: "Invalid test execution XML"

**Solution:**
- Validate JUnit XML format is correct
- Check test names contain XRAY keys
- Ensure test case exists in Jira

---

## 📊 Success Metrics

After successful upload, verify in Jira:

✅ **Test Case Linked**
- Xray-1 shows latest execution

✅ **Execution Status Updated**
- Clear PASS/FAIL status

✅ **Traceability Established**
- Can trace from Jira → Xray → Test Results

✅ **Test Evidence Available**
- Screenshots available (if enabled)

---

## 🔗 Resources

- [Xray Cloud API Docs](https://docs.getxray.app/)
- [JUnit Format](https://github.com/junit-team/junit5/wiki/JUnit-5-User-Guide)
- [Jira Cloud Documentation](https://support.atlassian.com/jira-cloud-administration/)

---

## 📝 Next Steps

1. Create test cases in Jira (XRAY-1, XRAY-2, etc.)
2. Configure API Client in Xray
3. Set environment variables
4. Run `npm test` locally
5. Run `npm run xray:upload` to verify
6. Push changes to GitHub
7. Workflow automatically uploads on every push
