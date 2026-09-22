<div align="center">

<img src="https://www.keeperpass.com/logo.svg" alt="KeeperPass" width="240">

**Your passwords live in your Google Drive. Not ours.**

An open-source password manager with no server and no database.
Your vault is one encrypted file inside your own Drive — and the key never
leaves your device.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue?style=for-the-badge)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open_Source-❤️-brightgreen?style=for-the-badge)](#-why-its-built-this-way)
[![No Server](https://img.shields.io/badge/No_Server-Nothing_to_Breach-important?style=for-the-badge)](#-the-trust-boundary)

[**Open the web app →**](https://vault.keeperpass.com) &nbsp;·&nbsp;
[Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/keeperpass/) &nbsp;·&nbsp;
[How it works](#-the-trust-boundary) &nbsp;·&nbsp;
[FAQ](#-faq)

<img src="https://www.keeperpass.com/images/web.png" alt="The KeeperPass web app showing an encrypted vault's item list" width="800">

</div>

---

## 💡 Why it's built this way

Every password manager breach has the same root cause: one company holding
millions of vaults in one place. The encryption is rarely the weak link — the
**concentration** is. A single database is a single target, and a single target
eventually gets hit.

KeeperPass removes the target. There is no KeeperPass account database. No
user table. No vaults sitting on someone else's infrastructure. Your vault is
a single encrypted file inside a folder in **your own Google Drive**, and the
key to it never leaves your device.

If there's nothing to hold, there's nothing to breach.

---

## 🔒 The trust boundary

KeeperPass has no server. The cryptography runs entirely in your browser, and
the only thing that ever reaches Google is the *output* of that cryptography —
bytes it can store but cannot read.

```
your browser                             │  Google Drive
─────────────────────────────────────────┼──────────────────────────
                                         │
  master secret                          │
        │                                │
        ▼                                │
     Argon2id  ──►  256-bit key          │
        │                                │
        ▼                                │
  vault  ──►  AES-256-GCM  ──►  ciphertext  ──►  vault.json.enc
                                         │
```

Everything to the left of the line happens on your device. Only the ciphertext
crosses it.

### One folder, one file per vault

```
keeperpass/
├─ personal.json.enc     ← ciphertext: readable by you, opaque to Google
└─ work.json.enc
```

That folder is KeeperPass's entire footprint in your Drive. Create a second
vault, get a second file. Delete the folder, and every trace of the app is
gone — your data was never anywhere else.

### The only permission it asks for

KeeperPass requests exactly one Google OAuth scope: **`drive.file`**.

That scope means an app can see **only the files it created itself**. Not your
documents. Not your photos. Not your backups. Not the folder your tax returns
live in. Everything else in your Drive is invisible to KeeperPass — not
because it promises to ignore it, but because Google's OAuth layer won't let
it look.

---

## ⚡ Quick start

### Web app (nothing to install)

**[vault.keeperpass.com](https://vault.keeperpass.com)** — sign in with Google,
choose a secret, done.

### Browser extension

| Browser | Status | Install |
|---|---|---|
| **Firefox** | ✅ Published | [Firefox Add-ons (AMO)](https://addons.mozilla.org/en-US/firefox/addon/keeperpass/) |
| **Chrome** | ⚠️ Build from source | [Build & install instructions](extension/README.md#build--install) |
| **Edge** | 🔜 In progress | — |

Chrome is currently source-only. That's a real friction point and we know it —
a Web Store listing is planned. In the meantime, the [build
instructions](extension/README.md#build--install) take about two minutes and
require no toolchain beyond Node.

### Mobile

Not yet on the App Store or Play Store. See
[mobile/README.md](mobile/README.md#build--install) to build it yourself.

---

## ✨ Features

| Feature | What it does |
|---|---|
| **Autofill** | Fill logins from the browser extension toolbar |
| **TOTP codes** | Two-factor secrets stored alongside your logins |
| **Password generator** | Configurable length and character sets |
| **Tags** | Organize items across vaults |
| **Multiple vaults** | Separate contexts (work, personal) as separate files |
| **CSV import / export** | Bring data in from elsewhere, take it back out |
| **Breach report** | Check every stored password against Have I Been Pwned |

### Under the hood

| Layer | What it does |
|---|---|
| **Key derivation** | **Argon2id** — memory-hard, tunable, resistant to GPU and ASIC cracking. Parameters: 64 MiB memory, 3 iterations, parallelism 4. |
| **Encryption** | **AES-256-GCM** — authenticated encryption. Tamper with a single byte of ciphertext and decryption fails outright rather than quietly returning corrupted data. |
| **Master secret** | Never transmitted. Never stored. Used once, in-browser, to derive the key. |
| **Breach checking** | Have I Been Pwned, via **k-anonymity**. Only the first 5 characters of a SHA-1 hash leave your browser — never the password, never the full hash. |

**What reaches Google's servers:** ciphertext and a temporary OAuth access
token. Nothing else. Google can host the file. Google cannot read it. Neither
can anyone else, because there is no third party holding the key — there is
no third party at all.

**Revoking access** is instant and unilateral. Remove KeeperPass from your
[Google Account permissions](https://myaccount.google.com/permissions) and it
loses access immediately. Your vault file stays exactly where you left it.

> **Read the code.** Every line that touches your vault — the KDF, the cipher,
> the Drive calls — is public under AGPL-3.0. You don't have to trust a
> security page. You can read the source.

---

## 📸 Screenshots

<div align="center">

### Web app
<img src="https://www.keeperpass.com/images/web.png" alt="KeeperPass web app — vault item list" width="720">

### Browser extension
<img src="https://www.keeperpass.com/images/ext.png" alt="KeeperPass browser extension popup" width="300">

### Mobile
<img src="https://www.keeperpass.com/images/mobile.png" alt="KeeperPass on mobile" width="260">

</div>

---

## 🤔 FAQ

### What happens if I forget my master secret?

**There is no recovery. This is the deliberate cost of the architecture.**

A "forgot password" flow requires someone to hold a recovery key — and that
someone becomes a target, a policy, and a point of failure. KeeperPass has no
server, so no recovery flow can exist without also being a backdoor. If your
secret never leaves your device, no one — including us — can reset it for you.

What to do instead:

- **Use a passphrase, not a password.** Four or five random words
  (`cobalt-lantern-trombone-heron`) is both stronger and easier to remember
  than a scramble like `Xk9#mQ2!`.
- **Write it down** and store it somewhere physically secure.
- **Back up the vault file.** It's a file in your Drive — copy it somewhere
  safe. A backup plus a remembered secret is a complete recovery strategy.
- **Check Drive version history.** Because each write overwrites the same
  file, Drive may retain earlier versions, letting you roll back to a previous
  vault state — provided you still know the secret that protects it.

If you lose both the secret and every copy of the file, the data is gone.
That's not a bug we can fix without breaking the thing that makes KeeperPass
worth using.

### Can Google read my vault?

No. What Google receives is AES-256-GCM ciphertext. Without the key — which
is derived from your master secret, on your device, and never transmitted —
it's indistinguishable from random bytes. A complete compromise of Google's
storage layer would not expose a single password. This isn't a policy
promise; it's a mathematical one.

### Isn't trusting Google a contradiction?

It's a fair challenge, and the answer is a distinction, not a dodge.

Google is being asked to **store bytes**, not to **protect them**. They are a
hosting provider, not a trusted party. Encryption happens before the file
ever leaves your browser, and the key is never sent anywhere. That's a
fundamentally different relationship than handing your vault to a company and
trusting its security team — because in that case, the company *can* read
your data, and you're relying on its promise not to.

Here, there is no promise to rely on. The ciphertext is all that arrives.

### Why Google Drive and not something else?

Two reasons: reach and permission granularity.

Drive is already where most people keep their files, so there's no new
account, no new password, no new bill. And Google's `drive.file` scope is
narrow enough — an app sees only what it created itself — to make this
architecture safe to offer to non-technical users without a scary consent
screen.

The vault is just a file, so the storage layer is technically swappable.
Supporting other backends is a reasonable future direction; it hasn't been
built yet.

### Does KeeperPass track me?

The app tracks nothing. No analytics, no telemetry, no error reporting, no
phone-home of any kind. The only network requests it makes are to Google's
Drive API, authenticated with your own token. Open your browser's network tab
and watch — that's the whole list.

### What if Google disables my account, or KeeperPass shuts down?

Neither event takes your vault with it, and this is the whole point of the
architecture.

If your Google account is suspended, the encrypted file still exists wherever
you've backed it up — and it's a file, so you can copy it anywhere. Because
there's no KeeperPass account and no server-side state, there's nothing for
us to lose on your behalf.

If the KeeperPass project disappears tomorrow, the source is public under
AGPL-3.0. Anyone can build it, fork it, or fix it. Your vault remains readable
by any version of the code, forever, because the file format is the format and
the key is yours.

### Can I use it offline? Can I self-host it?

The encryption and decryption are entirely local, so the crypto works
offline. Reading and writing the vault requires reaching Google Drive, which
means a network connection in practice.

The web app is a static front end — there's no server component to self-host.
If you'd rather not use `vault.keeperpass.com` at all, you can build the web
app from this repository and serve it yourself. It's the same code.

### Is it really free? What's the catch?

It's free because there's no infrastructure to pay for. No servers, no
database, no storage bill, no customer support tier to fund. You're using
your own Google Drive, which you already pay for if you pay for it at all.

There's no premium tier, no feature paywall, no "free for personal use" trap.
The project exists because the architecture should exist, and the source is
public because a security tool that isn't auditable isn't worth trusting.

---

## 🤝 Contributing

Contributions are welcome — especially security review.

- **Found a vulnerability?** Please **do not** open a public issue. Report it
  privately first (see [SECURITY.md](SECURITY.md) or email
  contact@keeperpass.com) so it can be fixed before disclosure. Coordinated
  disclosure protects users; a public issue protects no one.
- **Found a bug?** Open an issue with steps to reproduce and your browser/OS.
- **Want to add a feature?** Open an issue to discuss before writing code —
  it saves everyone time.
- **Want to review the crypto?** That's the most valuable contribution you can
  make. Read the KDF and cipher implementation and tell us what's wrong.

### Building from source

Each component has its own build instructions:

- [Extension →](extension/README.md#build--install)
- [Mobile →](mobile/README.md#build--install)

---

## 📄 License

**GNU Affero General Public License v3.0** — see [LICENSE](LICENSE).

You are free to use, study, modify, and redistribute KeeperPass. If you run a
modified version as a network service, the AGPL requires you to publish your
changes. That's deliberate: for a security tool, the source staying open is
the point.

---

<div align="center">

**KeeperPass** · Built by [Vironautics](https://keeperpass.com)

Your Drive. Your keys. Your vault.

*Not affiliated with Google.*

</div>
