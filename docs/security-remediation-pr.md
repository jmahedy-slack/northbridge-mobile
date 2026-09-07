# Remediate mobile authentication security issue

**Team:** Northbridge Bank — Mobile Engineering  
**Application:** Northbridge Mobile (demonstration build)  
**Baseline:** `demo-baseline-vulnerable`

## Summary

This change stops the mobile client from persisting the demo access token in AsyncStorage and from writing tokens, account identifiers, and payment payloads to application logs. Token persistence now uses Expo SecureStore. Session orchestration sits behind a dedicated authentication service rather than the API helper.

## Security impact

- Tokens are no longer recoverable from the unencrypted AsyncStorage file.
- Device logs and Metro consoles no longer receive bearer tokens or customer book dumps.
- Residual risk: the demo still uses a static synthetic token. A production build must obtain short-lived tokens from the bank identity platform and enforce certificate pinning — out of scope for this demonstration.

## Root cause

Session restore was implemented with AsyncStorage for Expo Go convenience, and request tracing logged full headers and bodies under a `__DEV__` guard. Neither control meets Northbridge standards for authentication secrets.

## Remediation

- `TokenStore` + `expo-secure-store` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`)
- In-memory session after login; profile data is not written to disk
- Removal of leftover `northbridge.session` AsyncStorage keys
- `logDev()` limited to method/path and session lifecycle events

## Tests

`npm test` covers login, failure, secure storage, AsyncStorage absence of secrets, log redaction, logout, and banking regressions.

## Backwards compatibility

Existing insecure AsyncStorage sessions are discarded. Users of the demo app will be asked to sign in again.

## Operational impact

None. There is no production telemetry pipeline in this repository.

## Rollback plan

```bash
RESET_DEMO=true ./scripts/reset-demo.sh
```

That restores `demo-baseline-vulnerable`. Do not ship that tag.

## Reviewer checklist

See `PULL_REQUEST_TEMPLATE.md`.
