# Freeze — agent rules

Read this before changing the extension or the install landing.

## HARD: Site = extension SoT for user-facing capabilities

The public install page must describe **the extension as it ships in this PR**, not a roadmap and not an older build.

**Source of truth for what users can do:** `manifest.json`, `src/`, and `popup/` if that folder exists.  
**Public claim surface:** `site/index.html` (plus `site/demo.js` / `site/styles.css` when the interaction itself changed). The `#capabilities` list on the landing is the checklist — if a behavior is not there, the site is not allowed to sell it.

Any change to **pause / thaw / rewind / volume / toolbar / badge / shortcut** behavior **MUST** update `site/index.html` (and the zip via the existing build) in the **same PR**. Do not wait for a second prompt. Do not merge extension behavior the landing still lies about.

### Same-PR checklist

When you touch freeze engine, popup, commands, or toolbar UX:

1. Update `#capabilities` and hero/sub/meta in `site/index.html` so every selling point is true of the new code.
2. Update `site/demo.js` if freeze/thaw/rewind/volume interaction changed.
3. Update `manifest.json` `description` / `default_title` if the one-liner changed.
4. If you add files the zip must contain (e.g. `popup/`), add them to `INCLUDE` in `scripts/pack.js`.
5. Run `npm run build` so `site/freeze.zip` matches `src/` (the packer copies the zip into `site/`).
6. Do not advertise rewind, volume, shortcuts, a popup, or “keep new media frozen” unless those are in `src/` on **this branch**.

### What ships on `main` today (keep this paragraph true)

Toolbar button only — **no popup**. Click pauses currently playing HTML5 `<video>` / `<audio>` in every open tab; click again resumes **only** elements Freeze tagged. Ice-blue icons + ❄ badge while frozen. New tabs after a freeze are not auto-frozen. Restricted pages are skipped. **Not shipped:** rewind-all, unified volume, keyboard commands, SPA/late-start re-pause.

When those land, this paragraph and `#capabilities` change in the same PR.

## Icons

Leave the ice-vs-snowflake mark alone unless the issue is explicitly about icons. Favicon and toolbar PNGs stay on the current snowflake until Phil decides otherwise.

## Deploy

Repo is private; Vercel git is not connected. Preview: `npx vercel@54 deploy --yes --scope menhir-holdings` (no `--prod` unless Phil locked production).
