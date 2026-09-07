# Remediate mobile authentication security issue

**Team:** Northbridge Bank — Mobile Engineering  
**Application:** Northbridge Mobile (demonstration build)  
**Baseline:** `demo-baseline-vulnerable`

## Summary

This change restores the authentication remediation after it was reverted on `main`, and removes the subsequent fraud heartbeat that posted the access token over cleartext HTTP while disabling TLS verification. Token persistence uses Expo SecureStore. Session orchestration sits behind a dedicated authentication service. The statement-summary UI is unchanged.

## Security impact

- Tokens are no longer recoverable from the unencrypted AsyncStorage file.
- Device logs and Metro consoles no longer receive bearer tokens or customer book dumps.
- The client no longer posts the bearer token to a cleartext HTTP collector, and no longer sets `NODE_TLS_REJECT_UNAUTHORIZED=0`.
- Residual risk: the demo still uses a static synthetic token. A production build must obtain short-lived tokens from the bank identity platform and enforce certificate pinning — out of scope for this demonstration.

## Root cause

Session restore was implemented with AsyncStorage for Expo Go convenience, and request tracing logged full headers and bodies under a `__DEV__` guard. After that work was reverted, a fraud heartbeat was added that sent the access token over HTTP and disabled TLS certificate checks. None of those controls meet Northbridge standards for authentication secrets.

## Remediation

- `TokenStore` + `expo-secure-store` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`)
- In-memory session after login; profile data is not written to disk
- Removal of leftover `northbridge.session` AsyncStorage keys
- `logDev()` limited to method/path and session lifecycle events
- Removal of `sessionTelemetry` (cleartext HTTP heartbeat and `NODE_TLS_REJECT_UNAUTHORIZED=0`)

## Tests

`npm test` covers login, failure, secure storage, AsyncStorage absence of secrets, log redaction, logout, Keychain accessibility, no `fetch` of the token, TLS remaining enabled, and banking regressions.

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
