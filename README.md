# Freeze

**One click freezes (pauses) media — especially YouTube — across every open tab. Click again to thaw and resume.**

Freeze is a tiny, zero-dependency Manifest V3 extension for Brave (and Chrome/Edge/any Chromium browser). The toolbar button is the whole UI:

- **Click once** → every currently-playing `<video>` / `<audio>` in every open tab pauses (YouTube, Twitch, Spotify web, SoundCloud, embeds, …).
- **Click again** → only the media *Freeze* paused resumes. Anything you had already paused stays paused.

The icon turns **ice-blue with a ❄ badge** while frozen so you always know the state.

## Install in Brave (Load unpacked)

1. Clone or download this repo.
2. Generate the icons once: `npm run icons` (or `node scripts/generate-icons.js`).
3. Open `brave://extensions` in Brave.
4. Toggle **Developer mode** on (top-right).
5. Click **Load unpacked** and select this project folder (the one containing `manifest.json`).
6. Pin **Freeze** to the toolbar and click it.

> Chrome/Edge work identically via `chrome://extensions` / `edge://extensions`.

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
site/                install/landing page (deployed to Vercel)
```

## Notes & scope

- Freeze acts on tabs that are **open at the moment you click**. Opening a new tab afterwards won't be auto-frozen — click again to catch it.
- Fully local: no network, no tracking, no accounts.

## License

MIT © Menhir Holdings
