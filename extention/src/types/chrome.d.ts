/**
 * The `chrome` extension API as a global.
 *
 * Previously this was global only by accident: `src/scripts/background.ts` has
 * no top-level import or export, which makes it a script rather than a module,
 * which in turn promoted its `declare const chrome` to a global for everything
 * `tsconfig.app.json` compiles. Six files under `src/app/` leaned on that
 * without declaring `chrome` themselves.
 *
 * Two things were wrong with it. Adding a single import to `background.ts`
 * would have turned it into a module and broken type-checking across the app
 * for no visible reason. And `tsconfig.spec.json` does not include
 * `src/scripts/`, so the global was missing under test — which is why the unit
 * suite could not compile at all.
 *
 * A `.d.ts` under `src/` is picked up by both: `tsconfig.app.json` includes
 * `src/**\/*.ts`, `tsconfig.spec.json` includes `src/**\/*.d.ts`.
 *
 * `any` preserves exactly what the scattered declarations already provided —
 * this consolidates them, it does not tighten them. Installing `@types/chrome`
 * and dropping this file is the real fix; that is a typing change with its own
 * fallout across the call sites, so it is deliberately not bundled in here.
 * Note `extension-session-storage.ts` keeps its own precise module-scoped
 * declaration, which shadows this one.
 */
declare const chrome: any;
