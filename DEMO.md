# Northbridge Mobile — demonstration script

This repository is a **synthetic** mobile banking application used to show a Cursor-led security remediation workflow. It is not a production bank app.

## Act 1 — Discover

Start on tag `demo-baseline-vulnerable`. Run the app if useful, then ask Cursor:

> Review this mobile banking application for security vulnerabilities. Focus particularly on authentication, credential/token handling, sensitive logging, local storage and API security. Do not modify any files yet. Explain the vulnerabilities, severity, attack surface and recommended remediation.

## Act 2 — Explain

Ask Cursor to explain:

- the vulnerability
- severity
- attack surface
- business impact
- remediation approach

Then:

> Create a remediation plan for the identified security issues. Map each issue to the relevant secure engineering principles. Do not implement the changes yet.

## Act 3 — Fix

> Implement the security remediation. Use the platform's recommended secure storage mechanism for authentication credentials/tokens. Remove sensitive logging, introduce an appropriate authentication/storage abstraction, and add tests proving that sensitive credentials are not written to insecure storage or logs.

## Act 4 — Verify

```bash
npm test
npm run typecheck
npm run lint
```

## Act 5 — Review

> Review your changes as a security engineer. Identify any remaining vulnerabilities, regressions or weaknesses in the remediation.

## Act 6 — Collaborate

Connect the repository to the engineering Slack workflow. Prompts live in `docs/SLACK_DEMO_CONTEXT.md`.

## Act 7 — Reset

```bash
RESET_DEMO=true ./scripts/reset-demo.sh
```

This returns the repository to `demo-baseline-vulnerable` so the demonstration can be repeated.
