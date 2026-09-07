# Northbridge Mobile

Fictional demonstration application for **Northbridge Bank**, a made-up UK retail bank.

This is **not** a real banking product. It does not connect to live payment rails, core banking systems, or production identity services. Every customer, balance, transaction, and credential in this repository is synthetic.

## Purpose

The repository exists to demonstrate an engineering workflow in Cursor:

**Security issue → investigation → remediation → tests → code review → deployment readiness**

Start from the tagged vulnerable baseline, review the application, then remediate it. Reset when you want to run the demonstration again.

## Demo customer

| Field | Value |
|---|---|
| Customer | Alex Morgan |
| Username | `a.morgan` |
| Password | `northbridge-demo` |
| Account | Northbridge Current Account |
| Balance | £8,421.63 |
| Sort code / number | 04-00-04 · 13884921 (fictional) |

## Run the app

```bash
npm install
npm start
```

Then open Expo Go, an iOS simulator, or an Android emulator.

## Checks

```bash
npm test
npm run typecheck
npm run lint
```

## Demo controls

```bash
./scripts/show-demo-state.sh
RESET_DEMO=true ./scripts/reset-demo.sh
```

The reset script restores git tag `demo-baseline-vulnerable` (insecure storage and sensitive logs). It will not run unless `RESET_DEMO=true` is set, and it will refuse to run if the working tree is dirty.

After a remediation commit, `main` may be ahead of that tag. Resetting is the supported way to repeat Act 1 of the demonstration.

## Important

Do not use real credentials, real customer data, or real bank endpoints in this project. See `DEMO.md` for the intended walkthrough.
