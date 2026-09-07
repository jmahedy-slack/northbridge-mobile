# Security test plan — Northbridge Mobile

All cases use synthetic demo data (`a.morgan` / `northbridge-demo`).

Run:

```bash
npm test
npm run typecheck
npm run lint
```

## Authentication

| Case | File | Expectation |
|---|---|---|
| Valid demo credentials | `__tests__/app.test.ts` | Session for Alex Morgan is returned |
| Invalid password | `__tests__/app.test.ts`, `__tests__/security.test.ts` | `AuthError`, no token stored |
| Restore after login | `__tests__/app.test.ts` | Token round-trips through secure storage |
| Token stored via abstraction | `__tests__/security.test.ts` | `expo-secure-store` holds the token |

## Security invariants

| Case | File | Expectation |
|---|---|---|
| Token is not in AsyncStorage | `__tests__/security.test.ts` | No `northbridge.session` key; no token string in AsyncStorage |
| Legacy blob is wiped | `__tests__/security.test.ts` | Pre-seeded AsyncStorage session is removed on login |
| Token is not logged | `__tests__/security.test.ts` | `console.log` output does not contain the token or `Bearer ` |
| Account / payment data is not logged | `__tests__/security.test.ts` | No account id, balance, transaction id, or payee account number |
| Logout removes the token | `__tests__/security.test.ts` | Secure store empty; `restoreSession()` is null |
| Legacy blob wiped on restore and logout | `__tests__/security.test.ts` | Pre-seeded AsyncStorage session is removed |
| Keychain accessibility is device-unlock only | `__tests__/security.test.ts` | `WHEN_UNLOCKED_THIS_DEVICE_ONLY` is passed to SecureStore |
| No network exfil of the token | `__tests__/security.test.ts` | `fetch` is not called during login or banking requests |
| TLS verification stays enabled | `__tests__/security.test.ts` | `NODE_TLS_REJECT_UNAUTHORIZED` is not set to `0` |

## Regression

| Case | File | Expectation |
|---|---|---|
| Account still loads | `__tests__/app.test.ts` | Northbridge Current Account, £8,421.63 |
| Transactions still load | `__tests__/app.test.ts` | Tesco, British Airways, salary, electricity |
| Payment still accepted | `__tests__/app.test.ts` | Simulated `pay_` id |
| Login after logout | `__tests__/app.test.ts` | Subsequent login can call the banking API |
