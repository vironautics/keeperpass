# KeeperPass

KeeperPass is a password manager with no server and no company database.

When you sign in with your Google account, KeeperPass encrypts your entire vault
right inside your browser or app, and saves the result as one file in a folder
inside **your own Google Drive**. Google only ever sees ciphertext — it can
store the file, but it cannot read it. There is nothing else to hold, so
there is nothing to breach.

This repository contains everything that makes up KeeperPass: the web app,
the browser extension, the mobile app, and the marketing website.

## How it works

1. **Sign in with Google.** KeeperPass asks for one narrow permission —
   `drive.file` — which only lets it see files it creates itself. Everything
   else in your Drive stays invisible to it.
2. **KeeperPass creates one folder**, called `keeperpass`, with one file in
   it: `vault.json.enc`.
3. **You choose a master secret.** It never leaves your device and is never
   sent anywhere. It's used once, locally, to derive an encryption key.
4. **Every change re-encrypts the whole vault.** Add an item, edit a note,
   delete something — the app re-encrypts the full vault and overwrites that
   one file in Drive.

Under the hood, your secret is run through **Argon2id** (a memory-hard key
derivation function built to resist GPU cracking) to produce a 256-bit key.
That key encrypts the vault with **AES-256-GCM**, an authenticated cipher —
if a single byte of the ciphertext is tampered with, decryption fails
outright instead of silently returning garbage.

## What's in this repo

| Folder | What it is | Stack |
|---|---|---|
| [`web/`](web) | The main web app, at vault.keeperpass.com | Angular |
| [`extention/`](extention) | The browser extension (autofill, quick access) | Angular |
| [`mobile/`](mobile) | The iOS/Android app | Expo (React Native) |
| [`welcome/`](welcome) | The public marketing site | Static HTML |

Each folder has its own README with setup instructions specific to that
project.

## Why it's built this way

- **No company database to breach.** Most password manager breaches happen
  because one company holds everyone's vaults in one place. KeeperPass
  doesn't hold any vaults — each one lives in its owner's own Drive.
- **Revoke access in one click.** KeeperPass only ever holds a temporary
  access token, never your data. Remove its access from your Google Account
  and it's gone instantly. Your vault file stays exactly where you left it.
- **Real breach checking.** The security report checks your passwords
  against Have I Been Pwned using k-anonymity — only the first few
  characters of a hash ever leave your browser. Your actual password never
  does.
- **A real password manager.** TOTP codes, a password generator, tags,
  multiple vaults, and CSV import/export — everything you'd expect, on an
  architecture most password managers don't use.

## Security

If you find a security issue, please do not open a public GitHub issue.
Instead, reach out privately so it can be fixed before it's disclosed. See
each sub-project's README for contact details, or open a private security
advisory on GitHub.

## Contributing

Pull requests are welcome. Since KeeperPass never runs its own backend for
vault data, most contributions live in one of the four project folders above
— check that project's README first for its specific setup steps.

## License

See [`LICENSE`](LICENSE).
