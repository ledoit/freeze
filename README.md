# Freeze

**Freeze, thaw, or rewind media — especially YouTube — across every open tab.**

Freeze is a tiny, zero-dependency Manifest V3 extension for Brave (and Chrome/Edge/any Chromium browser):

- **Freeze all / Thaw all** → pauses every playing `<video>` / `<audio>`, then resumes only what Freeze paused.
- **Back to 0:00** → rewinds all reachable media without changing whether it was playing or paused.

Freeze also catches media inserted or started after freezing on currently open pages.

Prefer no popup at all? `Alt+Shift+F` freezes/thaws instantly and `Alt+Shift+0` rewinds, without opening the panel.

## Install

**From the landing page (recommended):** open the [Freeze site](https://freeze.menhir-holdings.com), download `freeze.zip`, unzip it, then load the folder in your browser's extensions page.

**From this repo:**

1. Run `npm run build` once (generates icons, `dist/freeze.zip`, and `dist/freeze-unpacked/`).
2. Use `dist/freeze-unpacked/` directly, or unzip `dist/freeze.zip`.
3. Open `brave://extensions` (or `chrome://extensions` / `edge://extensions`).
4. Enable **Developer mode**, click **Load unpacked**, select the unzipped folder.
5. Pin **Freeze** to the toolbar.

> The landing page ships a ready-to-load zip so users don't need git or npm.

## How it works

- `src/background.js` is an MV3 service worker. Popup and keyboard actions are serialized through it.
- It runs `chrome.scripting.executeScript` against **all tabs, all frames**, injecting a self-contained controller that:
  - **Freeze:** pauses each playing media element and tags it with `data-freeze-paused="1"`.
  - **Thaw:** resumes only the tagged elements and clears the tag.
  - **Rewind:** seeks reachable media to `0:00` without changing play state.
- A capture listener plus `MutationObserver` catches late starts and SPA-replaced players while frozen.
- Stored state is verified against live page controllers, preventing a stale state from consuming the first click.
- Restricted pages (`chrome://`, the web store, etc.) are skipped gracefully.

## Scripts

| Command | Description |
| --- | --- |
| `npm run icons` | Regenerate PNG toolbar icons into `icons/`. |
| `npm run pack` | Build `dist/freeze.zip` (source only). |
| `npm run build` | Icons + zip. |

## Project layout

```
manifest.json        MV3 manifest
src/background.js    service worker (freeze/thaw/rewind controller)
popup/               two-action toolbar panel
icons/               generated PNGs (idle + frozen variants)
scripts/             icon generator + zip packer (no deps)
site/                install/landing page + freeze.zip (deployed to Vercel)
```

## Notes & scope

- Freeze acts on tabs that are **open at the moment you click**. Opening a new tab afterwards won't be auto-frozen — click again to catch it.
- Fully local: no network, no tracking, no accounts.

## License

All Rights Reserved © Menhir Holdings

## Project tracking

Linear is the source of truth — see [STATUS.md](./STATUS.md) and [TODO.md](./TODO.md).
