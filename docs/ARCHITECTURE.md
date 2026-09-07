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

Login talks to an in-app mock identity helper (`src/api/auth.ts`). The returned session blob is persisted so Expo Go can skip the login screen on the next launch.

API calls read that session and attach an `Authorization` header inside `src/api/client.ts`.

## Data

Customer, account and transactions live in `src/data/synthetic.ts`. Nothing in this tree is a real Northbridge customer.

## Follow-ups

A later change may introduce a dedicated auth module and tighten what is written to device storage and logs. That work is not in this commit.
