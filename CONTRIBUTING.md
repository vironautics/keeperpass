# Contributing to KeeperPass

Thanks for wanting to help out. This file explains how to get set up, how
this repo is organized, and how to submit a change.

## Ways to contribute

- **Bug reports** — open a GitHub issue. Include steps to reproduce, what
  you expected, and what actually happened. Screenshots help a lot for UI
  bugs.
- **Feature requests** — open an issue describing the problem you're
  trying to solve, not just the feature. It's easier to agree on a good
  solution when the "why" is clear.
- **Code changes** — bug fixes, features, refactors, docs. See below.
- **Security issues** — do **not** open a public issue. See
  [Reporting a security issue](#reporting-a-security-issue).

## Repo layout

This is a monorepo with one project per client:

| Folder | What it is | Stack |
|---|---|---|
| [`web/`](web) | The main web app | Angular |
| [`extention/`](extention) | The browser extension | Angular |
| [`mobile/`](mobile) | The iOS/Android app | Expo (React Native) |
| [`welcome/`](welcome) | The public marketing site | Static HTML |

Each one has its own `README.md` with setup steps, including how to get a
Google OAuth Client ID for local development — you'll need one, since
KeeperPass talks to Google Drive directly and there's no shared backend to
stub that out for you.

Start with the [root README](README.md) if you haven't already, so you
understand the "encrypt locally, store in the user's Drive" model before
touching the code.

## Getting set up

1. Fork the repo and clone your fork.
2. Pick the project you're changing (`web`, `extention`, or `mobile`) and
   follow its README to install dependencies and run it locally.
3. Create a branch off `main` for your change:

   ```bash
   git checkout -b your-name/short-description
   ```

## Making a change

- Keep pull requests focused. A PR that fixes one bug or adds one feature
  is much faster to review than one that does five unrelated things.
- Match the existing code style in whichever project you're touching —
  each one already has its own conventions (component structure, naming,
  how state is managed). When in doubt, copy the pattern used by the
  nearest similar file.
- If you're touching encryption, authentication, or anything that talks to
  Google Drive, explain **why** in the PR description, not just what
  changed. That code is the most security-sensitive part of the app and
  gets read the most carefully.
- Add or update tests for the behavior you're changing. Each project's
  README shows how to run its test suite (`npm test`).
- Update documentation (READMEs, code comments) if your change affects how
  something is set up or used.

## Before you open a pull request

Run the relevant project's checks locally first:

```bash
npm test
npm run build
```

Both should pass. CI also runs a Trivy vulnerability scan on every push to
`main` — if your change adds a new dependency, expect it to get scanned.

## Submitting the pull request

1. Push your branch and open a PR against `main`.
2. Describe **what** changed and **why**. Link any related issue.
3. If it's a visual change, include a screenshot or short recording.
4. Be responsive to review comments — small back-and-forth is normal and
   makes the change better.

Once approved, a maintainer will merge it. Please don't merge your own PR
unless you've been asked to.

## Reporting a security issue

If you find a vulnerability — anything related to the encryption, the
Google OAuth flow, or how vault data is stored or transmitted — please
**do not** open a public issue or PR. Instead, open a private GitHub
security advisory on this repo, or email
**vironauticsgroup@gmail.com** with details. We'll get back to you and fix
it before any public disclosure.

## License

By contributing, you agree that your contribution will be licensed under
this project's [AGPL-3.0 license](LICENSE).
