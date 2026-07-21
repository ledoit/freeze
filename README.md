# Freeze

**One click freezes (pauses) media — especially YouTube — across every open tab. Click again to thaw and resume.**

Freeze is a tiny, zero-dependency Manifest V3 extension for Brave (and Chrome/Edge/any Chromium browser). The toolbar button is the whole UI:

- **Click once** → every currently-playing `<video>` / `<audio>` in every open tab pauses (YouTube, Twitch, Spotify web, SoundCloud, embeds, …).
- **Click again** → only the media *Freeze* paused resumes. Anything you had already paused stays paused.

The icon turns **ice-blue with a ❄ badge** while frozen so you always know the state.

## Install

**From the landing page (recommended):** open the [Freeze site](https://freeze.menhir-holdings.com), download `freeze.zip`, unzip it, then load the folder in your browser's extensions page.

**From this repo:**

1. Run `npm run build` once (generates icons and `dist/freeze.zip`).
2. Unzip `dist/freeze.zip` — or use this folder directly if icons are already present.
3. Open `brave://extensions` (or `chrome://extensions` / `edge://extensions`).
4. Enable **Developer mode**, click **Load unpacked**, select the unzipped folder.
5. Pin **Freeze** to the toolbar.

> The landing page ships a ready-to-load zip so users don't need git or npm.

## How it works

- `src/background.js` is an MV3 service worker. `chrome.action.onClicked` toggles a `frozen` flag in `chrome.storage.local`.
- On toggle it runs `chrome.scripting.executeScript` against **all tabs, all frames**, injecting a self-contained function that:
  - **Freeze:** pauses each playing media element and tags it with `data-freeze-paused="1"`.
  - **Thaw:** resumes only the tagged elements and clears the tag.
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
src/background.js    service worker (toggle + injection)
icons/               generated PNGs (idle + frozen variants)
scripts/             icon generator + zip packer (no deps)
site/                install/landing page + freeze.zip (deployed to Vercel)
```

## Notes & scope

- Freeze acts on tabs that are **open at the moment you click**. Opening a new tab afterwards won't be auto-frozen — click again to catch it.
- Fully local: no network, no tracking, no accounts.

## License

All Rights Reserved © Menhir Holdings
