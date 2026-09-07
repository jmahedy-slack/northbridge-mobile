# Architecture — Northbridge Mobile

Fictional demonstration client. There is no live bank backend.

```
App
 └─ SessionProvider        restores the last session on launch
     └─ RootNavigator      login stack or signed-in tabs
         ├─ Accounts       overview + transaction list
         ├─ Pay            simulated Faster Payment
         └─ Profile        customer card + security settings
```

## Session

Login talks to an in-app mock identity helper (`src/auth/sessionService.ts`, re-exported from `src/api/auth.ts`). Only the access token is persisted, and only via `expo-secure-store` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`). Customer profile data stays in memory. Leftover `northbridge.session` AsyncStorage blobs are deleted on login, restore, and logout.

API calls read that token inside `src/api/client.ts`. Banking responses are local mocks — the client does not POST credentials to a network collector, and it does not disable TLS verification.

## Data

Customer, account and transactions live in `src/data/synthetic.ts`. Nothing in this tree is a real Northbridge customer.
