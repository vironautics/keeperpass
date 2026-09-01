# spartan/ui in ngkeeperspartan

`ngkeeperspartan` is the copy of `ngkeeper` whose UI is being migrated to
[spartan/ui](https://spartan.ng), component by component. Both design systems ship at
component by component. The stylesheet it started from has been deleted (see **One
stylesheet**), so a view that has not been migrated yet simply has no design.

For spartan's own conventions — composition rules, `hlm()`, icons, forms, the CLI
generators — read the official agent skill installed at `.agents/skills/spartan/`
(symlinked into `.claude/skills/spartan`, added with `npx skills add spartan-ng/spartan`).
**This file only covers what is specific to this repo.**

---

## Installed setup

| Thing           | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| spartan version | `@spartan-ng/brain` + `@spartan-ng/cli` 1.3.x               |
| Component style | **vega** (`components.json`)                                |
| Colour theme    | Hand-written in `spartan.css`, not one of spartan's presets |
| Helm components | `libs/ui/<name>/` — all 61 primitives generated             |
| Import alias    | `@spartan-ng/helm/<name>` (root `tsconfig.json` → `paths`)  |
| Tailwind        | v4 via `.postcssrc.json` → `@tailwindcss/postcss`           |
| Icons           | FontAwesome Pro via `<app-icon>` — see below                |

One global stylesheet (`angular.json` → `build.options.styles`): **`src/spartan.css`**
— Tailwind, the spartan preset, the webfonts and the theme variables. Plain CSS, not
SCSS, so Tailwind's `@import`/`@layer`/`@apply` are handled by PostCSS rather than Sass.

`libs/ui/` is in `.prettierignore` and stays byte-identical to upstream so the CLI's
`migrate-*` and `healthcheck` generators keep matching. Don't reformat it; edit a helm
file only to change its Tailwind classes.

---

## One stylesheet

`src/spartan.css` is the only global stylesheet. It holds Tailwind, the spartan preset,
the `@font-face` declarations, the design tokens, and the handful of app-shell rules
(`html, body` fixed to the viewport, `app-root` filling it).

**The ported stylesheet is gone.** `src/styles.scss` and `src/styles/` — reset, base,
layout, components, theme, animation, responsive, mixins — were a derivative of the
original project and could not be shipped, so they were deleted rather than migrated.
Nothing was copied out of them: the palette is the same set of colours re-expressed as
spartan's own tokens, and layout now lives in each component as Tailwind utilities.

**One token is this app's own: `--accent-strong`.** The accent (`#85ade5`) is a _fill_
colour — behind dark text it is fine, and that is what `--primary` is for. As _text_ it
is 2.2:1 on these surfaces, so an 11px field label in it is barely there and nowhere
near AA. Accented text and state icons therefore use `text-accent-strong`, which is
`#24559e` in light mode (6.9:1 on `--card`) and the accent itself in dark, where it
already reads at 7.7:1. It is mapped through `@theme inline` next to the tokens
spartan's preset declares, which is what makes the utility exist.

**Two colours live outside this file, and both are literal.** `index.html` paints the
pre-bootstrap backdrop and spinner — no stylesheet has loaded yet, so it carries its own
copy of the background and accent per `data-boot-theme`, and they have to be edited in
step with the tokens here. (It is the one piece of the app the token
layer cannot reach; the violet it used to be is gone.) The other is
`core/vault/tag-color.ts`, a categorical palette hashed from the tag name — nothing to
do with the theme, and deliberately free of the accent's hue so a tag chip does not read
as a brand colour.

There is no `legacy` cascade layer any more, and none of the traps that came with it:

- no unlayered rule outranking a Tailwind utility (`border: 0`, `color: inherit`,
  `font-size: inherit` in the old reset each did, and each cost a debugging session);
- no second token vocabulary for spartan's variables to chase;
- no class-name collisions between the two systems (`.grid`, `.collapse`, `.uppercase`,
  `--spacing` all used to need renaming on the legacy side).

Component-scoped `.scss` files each died with their component as it was migrated. Five
are left — `ui/icon`, `ui/logo`, `ui/google-logo`, `features/items/totp` and
`layout/app-shell` — and all five are the app's own drawing rather than ported chrome.
The rule still holds for them: a component stylesheet is unlayered, so if a spartan
class on one of those hosts seems to do nothing, look for the same property in that
component's `.scss` first.

## What is left of the old UI

**Nothing renders unstyled any more.** Every view is spartan, and with `/setup` and
`/recover` the last legacy widgets went with them:

| Deleted                                                                            | Went with                         |
| ---------------------------------------------------------------------------------- | --------------------------------- |
| `ui/{button,input,password-strength-meter,spinner}/`                               | `/setup` + `/recover`             |
| `features/auth/ui/auth-card/`                                                      | the last two screens that used it |
| `ui/{textarea,select,dialog,popover,scroller,toggle,toggle-button,slider,drawer}/` | the views migrated before them    |
| `layout/app-menu/` (incl. `menu-destinations.ts`)                                  | dead code — nothing imported it   |

`ButtonState` went with `ui/button`; every page now uses a plain `submitting` signal
and an `hlm-spinner` inside the button.

What is still hand-written, and meant to be:

| Kept                          | Why                                                                    |
| ----------------------------- | ---------------------------------------------------------------------- |
| `ui/icon/`                    | the FontAwesome renderer — 30-odd importers, not a legacy widget       |
| `ui/logo/`, `ui/google-logo/` | inline SVG marks                                                       |
| `features/items/totp/`        | draws its own countdown ring in SVG                                    |
| `layout/app-shell/*.scss`     | nothing visual: the `--inset-top`/`--inset-bottom` safe-area variables |

Five `.scss` files remain in `src/`, and they are exactly those four components. No
file under `src/` mentions a legacy token (`--app-*`, `--color-shade-*`,
`--start-form-*`, `--button-color`) or a legacy class name (`padded`, `subtle`,
`negative`, `highlighted`, `text-centering`); `grep` for any of them comes back empty.
`ThemeService` no longer puts `theme-dark`/`theme-light` on `<body>` either — `dark` on
`<html>` is the only theme switch, and `index.html`'s pre-bootstrap backdrop now hangs
off `data-boot-theme`, which `App` deletes on first render so `body`'s own
`bg-background` takes over.

## CLI notes specific to this repo

```bash
# Re-apply the base colour theme. ALWAYS pass the entry point.
npx ng g @spartan-ng/cli:ui-theme --project=ngkeeper --theme=neutral \
  --styles-entry-point=src/spartan.css
```

Three traps the generic docs don't mention:

- The Angular-CLI flags are **kebab-case**: `--styles-entry-point`, not
  `--stylesEntryPoint` (which errors out as an unknown argument).
- `ui-theme` **rewrites** its target file, and auto-detects `src/styles.scss` when no
  entry point is given. `@spartan-ng/cli:info` also _reports_
  `"tailwindCssFile": "src/styles.scss"` for the same reason — that's a convention-based
  guess, not this project's config. Passing `src/spartan.css` is what keeps the legacy
  stylesheet intact.
- Selecting "all" primitives is an interactive multiselect with no flag. To script it,
  call the generator's exported `createPrimitiveLibraries` with `{ primitives: ['all'] }`
  against an `FsTree` from `nx/src/generators/tree`.

---

## What has been migrated

| Surface                                     | Files                                                                                                  | Built from                                                                                                                                                                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The save overlay                            | `layout/sync-overlay/`                                                                                 | `dialog` (`disableClose`), `progress`, `spinner`, `alert`, `button`                                                                                                                                                                                           |
| `/support` and `/policies`                  | `features/support/support-page/`, `features/policies/policies-page/`                                   | `card`, `accordion`, `tabs`, `button`                                                                                                                                                                                                                         |
| `/settings` and its 4 sections + 3 dialogs  | `features/settings/**`                                                                                 | `card`, `field`, `input`, `input-group`, `select`, `dialog`, `alert`, `progress`, `spinner`, `item`, `badge`, `button`                                                                                                                                        |
| `/report`                                   | `features/report/report-page/`                                                                         | `card`, `popover`, `alert`, `badge`, `button`                                                                                                                                                                                                                 |
| `/vaults` and `/tags`                       | `features/vaults/vaults-page/`, `features/tags/tags-page/`                                             | `item`, `dialog`, `alert-dialog`, `field`, `input`, `empty`, `badge`, `checkbox`, `tooltip`, `button`                                                                                                                                                         |
| `/generator`                                | `features/generator/generator-page/`, `generator-panel/`                                               | `card`, `toggle-group`, `select`, `slider`, `checkbox`, `field`, `label`, `button`                                                                                                                                                                            |
| `/start` and the auth chrome                | `features/auth/start/`, `features/auth/auth-layout/`                                                   | `card`, `button`, `alert`, `spinner`                                                                                                                                                                                                                          |
| `/setup` and `/recover`                     | `features/auth/setup/`, `features/auth/recover/`                                                       | `card`, `field`, `input`, `input-group`, `progress`, `alert`, `spinner`, `button`                                                                                                                                                                             |
| `/unlock`                                   | `features/auth/unlock/`                                                                                | `card`, `field`, `input-group`, `button`, `alert`, `spinner`                                                                                                                                                                                                  |
| The signed-in shell — sidebar and inset     | `layout/app-shell/`, `layout/app-sidebar/`                                                             | spartan's [`sidebar-inset` block](https://github.com/spartan-ng/spartan/tree/main/apps/app/src/app/pages/%28blocks-preview%29/blocks-preview/sidebar-inset)                                                                                                   |
| The item row in the items list              | `features/items/item-row/`                                                                             | `item`, `badge`, `checkbox`, `hover-card`                                                                                                                                                                                                                     |
| The vault view: list, panes, empty states   | `features/items/items-list/`, `items-page/`, `no-item-selected/`                                       | `dialog`, `alert-dialog`, `select`, `input-group`, `empty`, `button`, `sidebar`                                                                                                                                                                               |
| The item detail panel, read + edit + create | `features/items/item-view/`, `item-field/`, `field-value-editor/`, `item-icon/`, `create-item-dialog/` | `item`, `dialog`, `alert-dialog`, `dropdown-menu`, `select`, `field`, `input`, `input-group`, `textarea`, `badge`, `button`, `empty`, `tooltip`, `typography`, `combobox`, `date-picker`, `progress`, `slider`, `toggle-group`, `checkbox`, `label`, `sonner` |

The shell is the parent route component for **every** signed-in route, so the sidebar
and header are spartan on `/items`, `/settings`, `/generator`, `/tags`, `/vaults`,
`/report`, `/support` and `/policies` — and so are the views inside the inset. The list
above is now the whole app.

### How the shell is put together

```
app-shell
└── app-sidebar            div[hlmSidebarWrapper]  (h-svh: the app never scrolls the document)
    ├── hlm-sidebar variant="inset" collapsible="icon"
    │   ├── hlm-sidebar-header    brand + version + hlmSidebarTrigger
    │   ├── hlm-sidebar-content   app-nav-vaults, app-nav-more
    │   └── hlm-sidebar-footer    app-nav-user
    └── <ng-content>        main[hlmSidebarInset]
        └── div.relative.flex-1   <router-outlet>
```

Five things differ from the upstream block, each for a reason:

- **The wrapper is `h-svh`, not `min-h-svh`.** html/body are fixed and each view owns
  its overflow; a min-height would let the document scroll behind the fixed body.
- **The inset's content sits in a `relative flex-1 overflow-hidden` div.** Routed
  views position themselves with `:host { position: absolute; inset: 0 }`, so they
  need a positioned box _below_ the header — absolute inside `<main>` itself would
  put them behind it.
- **`hlmCollapsible` goes on the `<li>`** rather than wrapping it in `<hlm-collapsible>`,
  which keeps `<ul>` holding nothing but `<li>`. The trigger and content only need a
  `BrnCollapsible` ancestor.
- **There is no bar of the block's own above the view.** Upstream puts a trigger +
  breadcrumb header inside the inset. Every view here already renders its own header
  with its title and actions, so that bar only repeated the title and cost 3.5rem;
  `layout/site-header/` is deleted and the trigger moved into the sidebar (see below).
- **The sidebar is `collapsible="icon"`, not the default `offcanvas`.** The only wide-screen
  trigger now lives inside the sidebar, so collapsing has to leave it on screen —
  offcanvas slides the whole column past the left edge and would take it along.

### One nav bar per width

The sidebar has to be reachable at every width, but the trigger must not appear twice:

| Width         | Sidebar                            | Trigger lives in                            |
| ------------- | ---------------------------------- | ------------------------------------------- |
| `< md` mobile | sheet over the page                | each view's own `<header>`, as first child  |
| `≥ md`        | column, collapsing to an icon rail | the sidebar's own header, right of the logo |

On a wide screen the toggle sits beside the wordmark and the view below it is nothing
but the view. Every `hlmSidebarMenuButton` carries a `tooltip` so the collapsed rail's
icons stay identifiable — helm enables it only while the sidebar is collapsed and not
mobile, so it never fires in the expanded column. The sidebar header's trigger shows at
every width; on mobile it is also the only visible way to close the sheet, since
`hlm-sidebar` hides the sheet's own close button.

Each not-yet-migrated view opens its header with

```html
<button hlmSidebarTrigger class="md:hidden" srOnlyText="Open navigation menu"></button>
<h1 class="header-title stretch collapsing spacing center-aligning horizontal layout">…</h1>
```

Before this, the whole title was an `<app-button>` calling `MenuService.toggle()` — the
only way to open the navigation on a phone was to tap the page title, which nothing
advertised, and on a 390px screen the title collapsed to two characters because the
button competed with the header's action buttons for width. `MenuService` existed only
to serve those title buttons and is **deleted**; the trigger talks to
`HlmSidebarService` itself. `.menu-button`'s `pointer-events: none` rule went from
`_responsive.scss` with it, and four pages lost their last `<app-button>` along with it.

Two things to know before editing it:

- **A directive combined with `hlmCollapsibleTrigger` loses its `data-slot`.** Both set
  it as a static host attribute and the last one wins, so the chevron buttons report
  `data-slot="collapsible-trigger"` rather than `sidebar-menu-action`. Nothing styles
  off `data-slot` in the sidebar (the selectors use `data-sidebar`), and upstream has
  the same collision — but query `[data-sidebar=menu-action]` when you need those
  buttons.
- **`layout/app-menu/` is now dead** — nothing imports `AppMenu`. It is kept for the
  moment as a reference for what the sidebar replaced (and its spec still runs); delete
  it, `menu-destinations.ts` and `ui/drawer`/`ui/scroller` once the sidebar has settled.

### How the item row is put together

`features/items/item-row/` — spartan's Item block, one row per vault item. The header
line is media + content + badges; the field chips wrap onto a second line because
`hlm-item-footer` is `basis-full`.

```
div[hlmItem size="sm"]                      relative, rounded-none!, border-b-border
├── hlm-checkbox                            selection mode only
│   or hlm-item-media variant="image"        favicon
│   or hlm-item-media variant="icon"         app-icon glyph
├── hlm-item-content
│   ├── hlm-item-description                 "Organization / Vault"
│   └── hlm-item-title  > a[routerLink]      item name — stretched over the whole row
├── hlm-item-actions                         hlmBadge ×n + favourite star
└── hlm-item-footer                          overflow-x-auto
    └── button[hlmItem variant="outline" size="xs"] ×n   one per field
```

Six things worth knowing before editing it:

- **Each field chip is a nested `hlmItem`.** A field is a name/value pair, which is what
  an Item renders. Nested `group/item` names resolve to the nearest ancestor, so the
  chip's `group-data-[size=xs]/item:` variants read the chip, not the row.
- **The row is a `<div>`, not an `<a>`.** The chips are `<button>`s, and a button inside
  an anchor is invalid. Instead the title's `<a>` carries
  `before:absolute before:inset-0` so the whole row is the link; the chips are
  `relative` and later in the DOM, so they paint above that overlay and stay clickable.
  Selection mode uses the same trick on the checkbox's own button — one control, whole
  row as its hit area, rather than a second redundant target.
- **`routerLinkActive` sits on the row, not the link.** The directive tracks descendant
  `routerLink`s; a `#ref` on the link would be scoped to its `@if` block. The row
  exposes it as `data-active="true|false"`, which drives `data-[active=true]:` variants.
- **Never put a typography utility on an `hlm*` host.** `classes()` only unions class
  names — it does not run tailwind-merge — so `text-xs` next to helm's `text-sm` is
  decided by stylesheet order. Put it on an inner `<span>` instead. Where a same-property
  override on the host is unavoidable, use Tailwind's `!` (`rounded-none!`), not luck.
- **Truncation needs `min-w-0` on every link in the chain.** `truncate` sets
  `white-space: nowrap`, which makes the text's min-content width the flex floor for all
  its ancestors — so `hlm-item-content`, `hlm-item-title`, `hlm-item-description` and the
  span itself each need `min-w-0`, or the text overflows the chip instead of clipping.
- **The row's text is `--foreground`, and the accent is reserved.** It used to inherit
  the old sheet's backdrop accent for everything; now the accent means something — a
  field label, the active row, a favourited star.
- **The hover-card wrapper is `contents`, not a box.** As a block it built a line box
  around its inline-flex badge — 3.8px taller than the badge beside it — and centring
  that taller box left the `+n` sitting a pixel below the other pills. `display:
contents` makes the badge itself the flex item, so every pill shares one baseline.
  (Note the `+n` button reports `data-slot="hover-card-trigger"`, not `badge`:
  `hlmHoverCardTrigger` and `hlmBadge` both set it statically and the last wins.)
- **Overflowing tags are a hover card, not a tooltip.** A row shows the first tag, then
  `+n` for the rest: there is no room to list them, and two characters each says less
  than the count does. The `+n` is an `hlm-hover-card` trigger whose content lists every
  tag as a `hlmBadge` in that tag's own colour. It is a `<button hlmBadge>` so it is
  focusable, and `relative z-10` so it sits above the title link's full-row overlay
  instead of navigating.

Icons are `<app-icon>`, the same as everywhere else in this app — see **Icons** below.

### How the vault view is put together

`features/items/items-page/` is the master/detail frame and `items-list/` the left
column. Two things are worth knowing.

**The pane split is one breakpoint, expressed twice.** Wide, the list is a fixed
`max-w-100` column beside the detail pane. At 700px — where 25rem of list plus a
readable detail stops fitting — both go `absolute inset-0` and the detail slides in over
the list. That is driven by `data-detail` on the wrapper with a `group-data` variant
rather than a class binding, because the class name (`max-[700px]:-translate-x-1/2`)
contains brackets that Angular's template parser will not accept. 700px is this pane's
own threshold, not a Tailwind breakpoint, so it is written as `max-[700px]:` /
`min-[701px]:` — the same pair the detail panel's back button and glyph use.

**The list header is search, sort, then the bulk actions.** Sort is one icon button
after the search toggle — `arrow-down` for newest-first (the default, since a just-added
item is the one you are looking for) and `arrow-up` for oldest-first, with the label and
tooltip naming the _current_ order. It sorts a copy of the filtered list by `updated`,
so filtering and sorting stay independent computeds.

**CDK's virtual-scroll viewport needs two things from its container**, and both are easy
to miss now that no global stylesheet supplies them:

- `min-h-0 flex-1` on the viewport. CDK makes it the scroll container, so without a
  bounded height it grows to fit its content and nothing scrolls — which is exactly how
  the list rendered zero rows the moment the old stylesheet went.
- `[&_.cdk-virtual-scroll-content-wrapper]:w-full`. For a _vertical_ viewport CDK
  constrains only the wrapper's height, leaving that absolutely-positioned element to
  shrink-wrap its content. A row's max-content includes every field chip laid end to
  end, so rows came out wider than the pane and the whole list scrolled sideways.

### How the item detail panel is put together

`features/items/item-view/` and its three children. One component, three modes: read,
edit (`?edit=true`) and create (`?new=true`, an unsaved `ItemDraftStore` draft) — the
same form either way, which is why they are not separate components.

```
app-item-view                     :host is `bg-card absolute inset-0` (it fills .pane-detail)
├── header                        back / glyph / vault + name / favourite · edit · ⋯
├── div.overflow-y-auto
│   ├── section  Tags             hlmBadge chips; edit adds a remove button and an
│   │                             hlm-input-group draft field with suggestion chips
│   ├── section  Fields           app-item-field (read) | app-field-value-editor (edit)
│   └── section  History          hlmItem rows, the newest badged "Current Version"
└── footer.save-cancel-row        edit only
```

Both field rows are `hlmItem`s, like the list's `app-item-row`: the field name is the
title, its value the description, and copy/reveal are `hlm-item-actions` on the same
line — dimmed to 60% until the row is hovered or focused, but always on screen, because
copying is the reason this screen exists and a touch screen never sends a hover.
`app-field-value-editor` stacks two ordinary spartan inputs instead of the borderless
pair it used to draw: an editable field name has no static label to sit under, so the
control has to look like a control.

**The panels draw the separators, not the rows** — `divide-y` on the section container,
so no row has to know whether it is last. A row that tried (`last:border-b-transparent`
on the row's own root) silently matched _every_ row, since each one is the only child of
its own component host, and the field list came out as one undivided block.

**Each field type gets the control that fits it.** The stored value is a plain string
either way — these only change how it is entered:

| Type             | Control                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `note`           | `hlmTextarea`                                                                                |
| `date` / `month` | `hlm-date-picker` / `hlm-month-year-picker`                                                  |
| `phone`          | searchable `hlm-combobox` of all 239 dial codes + a `type="tel"` input for the national part |
| `password`       | `hlm-input-group` with a generator button and a reveal toggle, plus a strength bar           |
| `pin`            | plain input, `inputmode="numeric"` — no strength bar, see below                              |
| `credit`         | `hlm-input-group` showing the detected brand and whether the number passes its checksum      |
| `email`          | `hlm-input-group` with a valid/invalid icon and a message                                    |
| everything else  | `hlmInput`, `type` from the field type                                                       |

Seven things worth knowing about them:

- **A picker's trigger prints the date itself, so pass `[formatDate]`.** Its default is
  `Date.toDateString()` — "Wed Jun 12 2024" — and the projected content is only used
  when that comes back empty, so styling the label from the outside does nothing.
- **Only a password gets a strength bar.** A PIN had one too, scored for digits
  (`core/validation/pin-strength.ts`, now deleted) — and it was wrong for the fields that
  actually hold PINs. A card's CVC is three digits _by definition_ and a card PIN is
  four, so the meter sat under a correctly-filled field reporting "Very weak — shorter
  than four digits", a problem with no fix. Nothing ever blocked saving one (a PIN's only
  validator is a length cap), but the reading was noise, so it is gone.
- **`inputmode="numeric"`, never `type="number"`, for digits.** A number input brings a
  spinner, accepts `1e5`, and can drop a leading zero — none of which a PIN wants.
- **Card brand and validity come from the number.** `core/validation/card-number.ts` runs
  Luhn and matches IIN ranges for 15 brands; nothing is fetched and nothing is stored.
- **239 countries needs a search box, which means a combobox, not a select.** The
  combobox's default filter matches the search against `itemToString` — a flag and a
  dial code here — so typing "germ" found nothing until a `[filter]` was passed that
  matches the country's name, dial code and ISO code with accents folded. Its content
  is `w-(--brn-combobox-width)`, anchored to a 7rem trigger, so it also needs `w-72!`
  or every row wraps onto a second line.
- **`hlm-combobox-trigger`'s host is an inline box, and its `class` lands on both.**
  The component passes `class` through to the inner `<button>`, but Angular also keeps
  the attribute on the host element — which has no display of its own. So `w-full` does
  nothing there, and a padding utility pads an _inline_ box: that offsets the button
  inside it and pushes it past the container's right edge, which is what made the phone
  field's picker start 8px right of the input above it and sit flush against the number.
  Give the host `flex` and aim size and padding at the button with `[&>button]:`.
- **The strength meter and the card read-out are in read mode too**, not only while
  editing: a weak password is worth knowing about at the moment you look at the item,
  which is when you would go and change it. `app-item-field` computes them from the
  real value even while it is masked — the meter says how strong the value is, never
  what it is.
- **Both strength meters read one scale.** `features/items/strength-scale.ts` holds the
  labels, the bar colours and the percentage, so the meter under a password field and the
  one in the generator dialog cannot disagree about what "strong" looks like.

**The generator is a dialog, not a detour.** `generate-password-dialog/` runs the same
primitives as the generator page (`core/generator`) behind `hlm-toggle-group` (characters
or words), `hlm-slider`, four `hlm-checkbox`es and an `hlm-progress` strength bar. It
hands the value back only on confirm, so opening it, looking, and cancelling leaves the
field exactly as it was. `hlm-slider` is a range control — its value is `number[]` even
with one thumb — and `hlm-toggle-group` emits `ToggleValue<T>`, so both need narrowing.

Six dialogs live in `item-view.html`, plus the create flow's template picker in
`create-item-dialog`. Things worth knowing:

- **Dialogs are driven from signals, not triggers.** What opens them is a menu item or
  a row, so there is no `hlmDialogTrigger` to hang them on: each takes
  `[state]="signal() ? 'open' : 'closed'"` and writes back through `(stateChanged)`,
  which is also what makes Esc and backdrop dismissal update the signal. The three
  destructive confirmations are `hlm-alert-dialog`; the rest are `hlm-dialog`.
- **Each dialog content carries an `aria-label`.** The title already labels it for
  screen readers; the attribute is what lets a person — or a test — tell six dialogs
  apart inside one overlay container.
- **A `hlm-select` needs `[itemToString]` when its value is an id.** The trigger
  stringifies the _value_, and `hlm-select-item`s only exist while the dropdown is
  open, so a closed trigger showed `vault-personal` instead of `My Vault`. Both selects
  here pass `[itemToString]="vaultOptionLabel"`.
- **Row-shaped buttons are `hlmItem`, not `hlmBtn`.** `hlmBtn` centres its content and
  rounds its corners, and overriding either means fighting stylesheet order; `hlmItem`
  is already a full-width flex row that starts at the start. That is what the "Add
  Field" row, the field-type list and the history rows use.
- **Field values say `text-foreground` and names say `text-accent-strong`.** Both
  started as workarounds for the document defaulting to purple (see _The default text
  colour_ above); they stay because naming the colour of a value is worth doing anyway.
  `text-accent-strong`, not `text-primary`, because a label is text — see **One
  stylesheet**.
- **Tags are added through the same picker as the country code.** An `hlm-combobox`
  whose list is every tag in the vault the item does not already have, searched by
  typing, plus a `Create “…”` row carrying a `\u0000`-prefixed sentinel value — a
  prefix no tag name can hold, since `displaySafeValidator` rejects control characters.
  The row's `[filter]` has to special-case that sentinel, or the create option filters
  itself out as soon as anything is typed.
  Its trigger shows a fixed `Add tag` label rather than `hlm-combobox-value`: what was
  picked becomes a chip immediately, so echoing it in the trigger would say it twice —
  and it means the combobox's own value can be left alone instead of reset after
  every pick. The typed name still goes through `tagDraftControl`, so the length and
  single-line rules are enforced by exactly the same validators as before.

`ui/textarea/` is now dead: nothing outside `src/app/ui/` imports it. Delete it with
the rest of the legacy `ui/` layer.

### How the auth chrome is put together

`features/auth/auth-layout/` is the parent route for every unauthenticated screen, and
it is three elements: an `absolute inset-0 bg-background overflow-y-auto` backdrop, a
`min-h-full max-w-100` column that centres its content, and the logo above the outlet.

Two things it has to do that the old sheet did invisibly:

- **Paint its own background.** Nothing sits behind these screens — the shell is not
  mounted yet — so a transparent layout showed the bare document, including
  `index.html`'s pre-bootstrap spinner, still spinning in the middle of the sign-in
  page. `App` now _removes_ that spinner on first render rather than relying on
  something covering it.
- **Own the scrolling.** `html`/`body` are fixed, so the layout scrolls, not the
  document — and the column is `min-h-full`, not `h-full`, so a step taller than the
  viewport (`/setup`, with its warning copy) scrolls instead of being clipped.

Each step's host is `block self-stretch`: the column is `items-center`, which would
otherwise shrink-wrap the step to its own max-content and make the card's `max-w-100`
resolve against a width that changes with the copy inside it.

`/start` itself is one `hlmCard`: header, the Google button (`hlm-spinner` in place of
the mark while the popup is open), a three-line list of what signing in actually grants
— `drive.file`, client-side encryption, no server — and an `hlmAlert variant="destructive"`
for a failed sign-in. It replaced the four-state `ui/button` with a plain `submitting`
signal: there is no success state to show, because success navigates away.

### How vault creation and recovery are put together

`/setup` (first run, no vault yet) and `/recover` ("forgot your secret") are the same
form: a secret, a strength meter, a repeat, a block of consequences, one button. Both
are one `hlmCard` in the auth column, the same shape as `/unlock`, so moving between
steps does not move the surface.

Four things worth knowing, all of them learned the hard way:

- **`hlmFieldError` is a component, not an attribute.** Its selector is
  `hlm-field-error` only, so `<p hlmFieldError>…</p>` matches nothing: no styling, no
  `role="alert"`, no announcement — it silently renders as a bare paragraph. Six of
  them were doing exactly that (tags, vaults, create-vault, change-password, both auth
  pages). Use `<hlm-field-error forceShow>`; without `forceShow` it stays hidden unless
  the _control itself_ is invalid, and a mismatch checked by a group-level validator
  never is.
- **`aria-invalid` on a helm input cannot be set by hand.** `BrnInput` binds
  `[attr.aria-invalid]` from its own field-control state, so any attribute you write is
  overwritten on the next tick. The lever is `forceInvalid`, which `hlmInput` forwards
  and `hlm-field` forwards too — `<hlm-field [forceInvalid]="mismatch()">` marks the
  whole field, which turns the label, the value and the border destructive. (Note
  `hlmInputGroupInput` applies `HlmInput` _without_ re-exposing its inputs, so inside an
  input group the field is the only place to ask.)
- **The `destructive` alert variant cannot carry a paragraph.** It colours its text
  `--destructive`, which is 4.1:1 on a `bg-destructive/10` tint at 14px — under AA. The
  IMPORTANT block therefore uses the **default** variant with the tint forced on
  (`bg-destructive/10!`), `text-foreground!` on the description, and the red carried by
  the border and the `warning` icon, where 3:1 is the bar. Short one-line errors keep
  the destructive variant on `bg-card` (4.6:1).
- **`hlmCardHeader` is a grid**, so `/recover`'s "Back to unlock" needs
  `justify-self-start`, not `self-start` — the latter is the block axis and leaves the
  button centred.

Both pages share one `revealed` signal across both secret fields: the second field
exists to be compared with the first, and revealing half a comparison helps nobody.
The strength meter is the same `hlm-progress` + `strength-scale.ts` pair the item
fields and the generator use, so "strong" means one thing everywhere.

### How the generator page is put together

`features/generator/generator-page/` is the frame — the same header shape as every other
view — and `generator-panel/` is one `hlmCard` holding the whole tool: an
`hlm-toggle-group` for passphrase / random string, then either two `hlm-select`s and a
word-count `hlm-slider`, or four `hlm-checkbox`es and a length one, then the result and
the two actions.

- **Same primitives as the generator dialog** (`features/items/generate-password-dialog/`),
  deliberately: one is the standalone page, the other fills a password field, and they
  should not read as two different features. The page adds the passphrase options —
  separator and language — that the dialog leaves out.
- **A `hlm-select` needs `[itemToString]` when its value is not its label.** Both selects
  here hold raw values (`-`, `en`), so a closed trigger showed `-` until they were given
  `separatorLabel` / `languageLabel`. Same trap as the move-to-vault select.
- **The regenerate pulse is `Element.animate`, not a CSS class.** It re-triggers on every
  call without the remove-reflow-add dance a keyframe class needs, and it keeps a
  one-component animation out of the one global stylesheet. Skipped under
  `prefers-reduced-motion`.
- **No `aria-live` on the result.** The value regenerates on _every_ option change, so a
  live region would read a fresh password aloud on each step of the slider.
- **The panel is centred, and the scroller is the element outside the centring one.**
  Centring inside the scroll container clips the top once the content is taller than the
  viewport: `overflow-y-auto` outside, `flex min-h-full items-center` inside.

### How the vaults and tags pages are put together

Two management lists, same shape: the standard header — with the same select-multiple
and add actions on both — a `divide-y` list of `hlmItem` rows inside a bordered card, an
`hlmEmpty` when there is nothing, and the row actions as ghost icon buttons in
`hlm-item-actions` — dimmed to 60% until the row is hovered or focused, because a touch
screen never sends a hover and these actions are the only thing either page does.

- **The list is a `max-w-3xl` column, not the full window.** A row is a name and two
  numbers; full-bleed, its actions ended up an inch of empty space away from the name
  they belong to on a desktop screen.
- **Each row says how much is in it and since when.** A vault row shows its item count
  (`store.itemsInVault`) and `Vault.created`; a tag row shows its usage count and when it
  was registered. Both are `hlm-item-description` under the title, not extra columns —
  the row stays one line of meaning at any width.
- **`Vault.created` and the tag registry's dates are new, and both are optional.** A
  vault or tag saved before they existed simply has none, and the row omits the phrase
  rather than inventing a date. The tag registry used to be `string[]`; it now holds
  `{ name, created }` entries and `hydrate()` accepts either shape (see
  `reviveTagRegistry`). A tag with no stored date falls back to the earliest `created`
  among the items carrying it — the closest truthful answer.
- **The personal vault is a footnote, not a row.** It cannot be renamed or deleted, so a
  row for it would carry two disabled buttons; the line under the list says what it holds
  instead.
- **`create-vault-dialog` is spartan now**, which is what the vaults page's `+` opens —
  and the sidebar's `+`, since they share it.

- **Naming dialogs are `hlm-dialog`; destructive ones are `hlm-alert-dialog`.** Six of
  them across the two pages, every one driven from a signal (`[state]` /
  `(stateChanged)`) rather than a trigger, since what opens them is a row button or a
  header action. Each content carries an `aria-label`, which is what tells them apart
  inside one overlay container.
- **A duplicate name is an error on one page and a note on the other.** Renaming a vault
  onto an existing name is refused (`hlmFieldError`, Save disabled); renaming a _tag_
  onto an existing tag merges them, which is a legitimate way to tidy a vault — so it is
  `hlmFieldDescription` and Save stays enabled. The wording says which is happening.
- **The personal vault is filtered in the component, not the template.** `renameableVaults`
  drops it, so "is this list empty" and "what is in this list" are the same question; the
  old template filtered inside its own `@for` and answered them differently.
- **A tag row keeps its colour while selecting.** The checkbox takes the leading slot the
  way `app-item-row` does, but the tag glyph stays beside it: the colour is how a tag is
  recognised, and dropping it turns the selection list into a column of names.

### How the security report is put together

`features/report/report-page/` is one `hlmCard` per audit type in a
`grid-cols-[repeat(auto-fit,minmax(min(20rem,100%),1fr))]` — three cards wide on a
desktop, one on a phone, with nothing to keep in step with the sidebar's width.

- **`hlmCardHeader` is a grid, not a flex row.** Its own class list carries `grid` and
  `auto-rows-min`, so four children became four rows and the header came out three times
  too tall with a `flex-row` on the host that never applied. One flex child inside it
  instead: the grid has a single row, and that row lays itself out.
- **The long explanations live in an `hlm-popover`.** `#info="brnPopover"` on the
  `hlm-popover` is how the trigger gets a handle on its own popover
  (`[hlmPopoverTriggerFor]="info"`) — the trigger takes the popover _instance_, not a
  template ref.
- **The all-clear is stated, not implied.** With no findings the page used to be three
  empty boxes, which reads as a load failure; it now leads with an `hlmAlert` saying every
  password passed, and each card says "Nothing found".
- **The rows are `app-item-row`, `pointer-events-none`, inside a `role="button"` wrapper.**
  The row renders its own link and copy buttons, and a button inside a link is invalid
  HTML that breaks hit testing, so the wrapper owns the click and the keyboard handling.
  The field chips are hidden from the outside
  (`[&_[data-slot=item-footer]]:hidden`) — a 20rem card cannot hold 8rem chips, and this
  page is about _which_ item is at risk, not what is on it.
- **The header badge and the sidebar badge read the same signal.** The cards count
  _findings_ — one item with a weak and reused password appears in two of them — so their
  sum is larger than the number of items at risk. The header showed that sum while the nav
  showed `AuditService.flaggedCount`, and two numbers for "how much is wrong" on one
  screen read as a bug. The badge now shows `flaggedCount` too, and says "items flagged"
  so the difference from the cards is legible. `flaggedCount` also counts against the
  vault rather than the findings map, so an item deleted since the last audit cannot
  inflate it.
- **A card header with `border-b` needs `pb-*!`.** helm adds `pb-(--card-spacing)` — 24px
  — to `hlmCardHeader` whenever it carries `border-b`, which left the header row 12px from
  the top and 25px from the bottom. Measured, not eyeballed: 12/12 after the override.

### How the settings page is put together

`features/settings/settings-page/` is a `max-w-3xl` column of four `hlmCard` sections —
profile, language, master password, import/export — over three overlay dialogs.

- **Every section is a card, and the shared `settings-section.scss` is gone.** Its
  `.section` / `.section-title` / `.row` chrome is what `hlmCard` already is.
- **The profile is read-only, and says why.** Email and display name belong to the Google
  account the session signed in with, and `UnlockPage` re-reads them from Google
  (`AuthService.fetchProfile`) on every mount — so anything typed into the old editable
  form was silently overwritten at the next unlock. They are a `<dl>` of values now, under
  a line pointing at the Google account, and the form, its validators, its dirty tracking
  and its Save/Cancel row are gone (which also retired `ui/drawer` from this page and made
  `settings.profile.emailInvalid` unreachable — it was removed from all five locales).
- **Three selects, three `[itemToString]`s.** Locale codes, vault ids and format ids are
  all values that are not their own labels, so every trigger needs the lookup — the same
  trap as the move-to-vault select.
- **The change-password dialog lost the four-state button.** Success closes the dialog and
  failure is the alert underneath, so there is nothing for a tick or a cross to report:
  a `submitting` flag drives an `hlm-spinner` instead. Its strength meter is now
  `strength-scale.ts` — the same scale as the item fields and the generator, so "weak"
  means one thing in all three places — which retires `ui/password-strength-meter` from
  this page.
- **Exports are remembered, in the vault.** `VaultStore.recordExport()` prepends to
  `VaultSnapshot.exportHistory` and caps it at `EXPORT_HISTORY_LIMIT` (10), and the export
  dialog records _after_ handing the file to the browser, then syncs — so the list only
  ever shows exports that happened, and it survives a closed tab. It lives in the vault
  rather than `localStorage` because it is a record of what left the vault and when: that
  belongs behind the same encryption as the data, and it should follow the user to their
  other devices. The record is metadata only — format, scope, item count, file name,
  timestamp — never exported content.

### How support and policies are put together

Two content pages, both a `max-w-3xl` reading column of `hlmCard` sections: legal text and
explanations at full window width run to 200 characters a line and nobody reads them.

- **The FAQ is an `hlm-accordion`, with the first question open.** Seven answers no longer
  have to be scrolled past to reach the eighth, and "what if I forget my secret?" — the
  question people arrive with, and the one with consequences — is expanded on arrival via
  `isOpened`. Closed content stays in the DOM (brain marks it `inert` with zero height
  rather than removing it), which is why the existing `textContent` assertions still pass.
- **Policies uses `hlm-tabs`, and the page keeps its own `activeTab` signal.** `[tab]`
  feeds the tabs and `(tabActivated)` writes back, so the component can still be asked
  and told which document is showing. Both panels stay mounted, so a `querySelector`
  finds headings from either — assert on the _visible_ text, not on DOM order.
- **The prose is styled from one wrapper.** `[&_h3]:font-semibold [&_ul]:list-disc …` on
  the card content beats putting a class on forty headings, and the legal copy itself was
  moved across verbatim — not retyped.

Between them these two pages retire 466 lines of component `.scss`.

### How the save overlay is put together

`layout/sync-overlay/` is the one dialog in the app that must not be dismissible: it is
on screen while the vault is being encrypted and uploaded, and anything the user can
touch mid-save is something that can interrupt it.

- **`disableClose` on `hlm-dialog` is what does the blocking.** brain routes Escape,
  backdrop clicks and outside pointer events through `BrnDialog.dismiss()`, which returns
  early while `disableClose` is set. `[showCloseButton]="false"` removes the × as well,
  so there is no control at all during a save. Verified with real CDP input, not synthetic
  events: a genuine Escape keypress and a genuine backdrop click both leave it open.
- **`[state]` is one-way.** What closes it is the save finishing or the error being
  dismissed — both service state — so nothing is written back from the dialog.
- **It replaced the app's last native `<dialog>`.** That was chosen originally for the top
  layer, a real `::backdrop` and inertness; the CDK overlay gives the same three things,
  so `ui/dialog` is deleted and there is one dialog implementation in the app instead of
  two. Its spec moved from `dialog.open` to "is it in the overlay container".
- **Failure still needs a decision.** Retry and Dismiss, never an auto-close: a dialog
  that closes itself after a failed save is indistinguishable from one that succeeded.

### Copy feedback

`<hlm-toaster>` is mounted once, in `app.html`, and the toast is raised in
`core/clipboard/clipboard.service.ts` rather than at each call site — a copy is a copy
whether it came from a row chip, a field's copy button or a keyboard shortcut, and the
message should not depend on which. `copy(value, { field, item })` writes to the
clipboard and then says `"<field> copied"` / `"From <item>"`; called without the second
argument it stays silent, for the paths where a toast would be noise.

The row and the field row keep their own inline "copied" flash as well. The toast says
_what_ was copied and from where; the flash says _this control_ is the one you hit.

Two things to know when verifying it in a browser: `navigator.clipboard.writeText`
needs a real user gesture (a synthetic `.click()` from the console rejects with
`NotAllowedError`, and the toast never fires because the write threw), and the sonner
container is only in the DOM once a toast exists — an absent `[data-sonner-toaster]`
does not mean the toaster was never mounted.

### Testing a spartan surface

Two things change for a spec when a component moves to spartan, and both bit here:

- **Overlay content is not under the component host.** Dialogs, dropdown menus and
  select panels render into `.cdk-overlay-container`, a sibling of the fixture's host
  element, and a _closed_ overlay is not in the DOM at all — so `host().querySelector`
  finds nothing and there is no `dialog.open` to read. `item-view.spec.ts` and
  `create-item-dialog.spec.ts` look them up from `document` and treat presence as open.
- **jsdom has no layout, so `Element.prototype.scrollIntoView` is missing.** spartan's
  select calls it on the active option while opening, and without it the overlay never
  attaches. Shimmed in `src/test-setup.ts` alongside the other platform stubs.

## Icons

**App icons are FontAwesome Pro, rendered by `<app-icon>`.** `public/fonts/` ships the
Pro Thin/Light/Regular faces, and `ui/icon/icon-glyphs.ts` maps a semantic name to a
codepoint; `<app-icon name="vault">` is the only way to draw one, because the Pro assets
here are a _webfont_, not SVGs, and `@ng-icons` can only take an SVG string.

So spartan surfaces use `<app-icon>` too, and pass the model's own `IconName` straight
through — `itemIconName(item)`, `fieldDefinition(type).icon`, `AUDIT_ICONS[type]`,
`template.icon` all already return one. An earlier attempt mapped those names onto
lucide equivalents (`ui/icon/lucide-glyphs.ts`, now deleted); it put a second icon
vocabulary on screen next to the first, and the two disagreed — most visibly on vaults,
where the sidebar drew a lucide safe while the list header drew the FontAwesome
layer-group for the same thing.

**An `<app-icon>` never shrinks, and that is declared once in `icon.scss`.** The glyph
inside is absolutely positioned, so the host box's min-content width is 0: as a flex item
with the default `shrink: 1` it collapses the moment a line is over-constrained. That is
what emptied the collapsed sidebar — a 32px rail button holding an 18px icon, an 8px gap
and a label shrank the icon to **1.8px**, and what showed through the button's
`overflow: hidden` was the first sliver of the _label_. helm's own guard
(`[&_ng-icon]:shrink-0`) matches `ng-icon`, not `app-icon`, so this app needs its own —
`flex-shrink: 0` on the host, not a `shrink-0` at each of eleven call sites. Measured
after: icon 19.5px, label collapsed to 0 and clipped past the button edge, all eleven rail
icons 18–19.5px.

**The table is generated, not hand-written.** `npm run icons` runs
`tools/generate-icon-glyphs.mjs`, which reads FontAwesome's own
`fontawesome.css` from the release the app ships in `public/fonts` and writes
`icon-glyphs.ts`. The script holds the only decision that matters — which glyph stands
for which idea in this app — as a map of app name to FontAwesome name
(`weak: 'shield-exclamation'`), and an unknown FontAwesome name fails the run rather
than emitting a blank glyph. So the codepoints cannot drift from the font, and adding an
icon is one line plus a re-run.

That replaced a hand-maintained codepoint table, and it fixed the class of bug that
table kept producing: `arrow-up` had pointed at `f308` (a minus in an octagon) while
being drawn as the items list's sort control, `weak` at `f4bb` (a cracked wine glass) on
every flagged item, and `bank` at `f53d` (money-check-dollar). The generated table is
verified the same way any of them should be — by rendering it: a sheet of all 81 glyphs
in `fa-light-300` from a local `file://` page (the dev server rewrites unknown paths to
`index.html`, so a sheet served from `public/` comes back as the app).

The names are this app's vocabulary, so they read as intent at the call site: `alert`,
`audit-clean`, `select-all`, `favourite`, `info-circle`, `computer`, `chevron-left`.
Only the 81 icons actually used are in the table; the sixty-odd left over from screens
this app does not have (orgs, billing, admin) are gone, and `strictTemplates` turns a
name that no longer exists into a build error rather than a tofu box.

`app-icon` sizes itself at `1.3em` and inherits `font-size` and `color`, so it fits
spartan's contexts without help. What it does _not_ pick up are helm's own
`[&_ng-icon]:…` rules (they select the `ng-icon` element by name), so a size that has to
be exact needs a `text-*` utility at the call site.

**Two icon sets are still on screen.** helm's copied components draw their own chrome
with lucide — the sidebar trigger's panel-left, the checkbox tick, the select chevron,
the dialog close. Those are part of the widget rather than app iconography, and changing
them means editing `libs/ui` templates (and pointing them at app code), so they were
left alone. Worth revisiting if the mixture shows.

```bash
# after editing the map in tools/generate-icon-glyphs.mjs
npm run icons
```

## Migrating a component

1. Find the primitive (`https://spartan.ng/components/<name>`, or the MCP tools). Confirm
   the selectors — don't guess them.
2. Import the `Hlm<Name>Imports` const from the alias, never a relative path:
   `import { HlmButtonImports } from '@spartan-ng/helm/button';`
3. Replace the markup, then **delete the component's `.scss` and the legacy classes it
   used.** Leaving both behind is how the two systems start fighting.
4. Some primitives need explicit children the wrapper doesn't create — e.g.
   `<hlm-progress>` renders an empty track without `<hlm-progress-indicator />` inside
   it. Check the docs page before concluding a primitive is broken.
5. Verify in **both** themes.
6. `.claude/CLAUDE.md` still applies: signals, `input()`/`output()`, `OnPush`, native
   control flow, `host` object over `@HostBinding`, no `ngClass`/`ngStyle`, WCAG AA.

Suggested order — the views that are unusable first, then leaves, so each step brings
a screen back rather than growing the overlap:

1. ~~`layout/app-shell` + `layout/app-menu` (→ `sidebar`)~~ — **done**
2. ~~`features/items/item-row`, the item detail panel, `create-item-dialog`~~ — **done**
3. ~~`features/items/items-list` + `items-page` + `no-item-selected`~~ — **done**
4. ~~`features/auth/start` + `auth-layout`~~ — **done**; `setup` and `recover` next
   (they share `ui/auth-card`, which dies with the second of them)
5. `features/settings` and its sections and dialogs
6. ~~`features/generator`, `vaults`, `tags`, `report`, `settings`, `support`, `policies`, `layout/sync-overlay`~~ — **done**: every routed view is spartan
7. The `ui/` widgets, as their last caller stops importing each one. **Deleted so far:**
   `slider`, `toggle-button`, `popover`, `select`, `dialog`, `scroller`, `drawer`,
   `toggle`, `textarea` — and `layout/app-menu`, which was dead code holding several of
   them alive. **Left:** `button`, `input`, `password-strength-meter` and `spinner`, all
   four kept alive by `features/auth/setup` and `features/auth/recover`, the last two
   legacy screens (`ui/button` is what pulls in `ui/spinner`). Migrating those two pages
   retires all four. `ui/icon`, `ui/logo` and `ui/google-logo` stay — they are the app's
   own, not legacy widgets.

The migration is done when the last component `.scss` and the last legacy class name are gone.

---

## Verifying visually

```bash
npx ng serve --port 4310

# light
google-chrome --headless=new --disable-gpu --no-sandbox \
  --blink-settings=preferredColorScheme=1 --window-size=1000,900 \
  --virtual-time-budget=12000 --screenshot=/tmp/light.png http://localhost:4310/

# dark — omit the flag; headless defaults to dark
google-chrome --headless=new --disable-gpu --no-sandbox --window-size=1000,900 \
  --virtual-time-budget=12000 --screenshot=/tmp/dark.png http://localhost:4310/
```

`preferredColorScheme=2` does **not** mean dark. For a real interaction test — clicking
the theme button, checking persistence across a reload — start Chrome with
`--remote-debugging-port=9222` and drive it over CDP.
