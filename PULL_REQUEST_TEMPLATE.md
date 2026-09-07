## Summary

<!-- What changed and why. -->

## Security impact

<!-- Who is affected, what is no longer possible, residual risk. -->

## Root cause

<!-- Why the issue existed. -->

## Remediation

<!-- What was implemented. -->

## Tests

<!-- How the fix is proven. -->

## Backwards compatibility

<!-- Session migration, app version, Expo Go vs native builds. -->

## Operational impact

<!-- Logging, support, crash reporting, release notes. -->

## Rollback plan

<!-- How to revert, including the demo reset command if relevant. -->

## Reviewer checklist

- [ ] No real credentials or customer data added
- [ ] Tokens are not written to AsyncStorage
- [ ] Tokens and account payloads are not logged
- [ ] Authentication is centralised behind a storage abstraction
- [ ] Logout removes the persisted session
- [ ] Unit tests cover the security invariants
- [ ] Lint and TypeScript checks pass
