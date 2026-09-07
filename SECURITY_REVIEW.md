# Security review — Northbridge Mobile

Fictional demonstration findings. No real customer or production credential is involved.

## Finding 1

### Title

Insecure Authentication Token Storage

### Severity

High

### Affected component

`src/api/auth.ts` on tag `demo-baseline-vulnerable` (replaced by `src/auth/sessionService.ts` and `src/auth/secureTokenStore.ts`).

### Why it is risky

The access token was written to AsyncStorage as part of a JSON session blob. AsyncStorage is not backed by the iOS Keychain or Android Keystore. On a rooted or jailbroken device, via a malicious app with backup access, or through local filesystem inspection of an unencrypted app sandbox, that token can be recovered and replayed.

### Baseline behaviour

`login()` called `AsyncStorage.setItem('northbridge.session', JSON.stringify(session))`, including `accessToken`, customer identifiers, and account id. `restoreSession()` read the same key.

### Remediation

- Introduced a `TokenStore` abstraction.
- Persist only the access token with `expo-secure-store` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`).
- Hold the rest of the session in memory.
- Delete any leftover `northbridge.session` AsyncStorage value on login, restore, and logout.

### Verification

See `SECURITY_TEST_PLAN.md` and `__tests__/security.test.ts`.

## Finding 2

### Title

Sensitive Information Exposed Through Application Logging

### Severity

High

### Affected component

`src/api/auth.ts`, `src/api/client.ts`, and `src/screens/OverviewScreen.tsx` on the vulnerable baseline.

### Baseline behaviour

Development logs printed the access token, `Authorization` headers, account identifiers, balances, transaction ids, and payment payloads. `__DEV__` gating does not stop Metro, device logs, or crash reporters from capturing those lines during internal testing.

### Remediation

- Removed token, header, and payload logging.
- Added `logDev()` which records only coarse events (`session established`, HTTP method + path).
- Overview no longer logs the customer book.

### Verification

`__tests__/security.test.ts` spies on `console.log` and asserts that tokens, account ids, balances, and payment account numbers never appear.
