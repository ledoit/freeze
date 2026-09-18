# Freeze

**The Freeze popup pauses playing HTML5 video and audio — especially YouTube — across every open tab. Thaw resumes only what Freeze paused. Rewind to 0:00 or set volume on all of them at once.**

Freeze is a tiny, zero-dependency Manifest V3 extension for Brave (and Chrome/Edge/any Chromium browser). Pin it, open the popup:

- **Freeze all** → currently-playing `<video>` / `<audio>` in every open tab pauses (YouTube, Twitch, SoundCloud, embeds, and other pages that use HTML5 media).
- **Thaw all** → only the media *Freeze* paused resumes. Anything you had already paused stays paused.
- **Back to 0:00** → rewinds reachable media; each element keeps playing or paused.
- **All-tabs volume** → one slider sets volume together.

The icon turns **ice-blue with a ❄ badge** while frozen so you always know the state.

## Landing lockstep

The install site is not a brochure of future work. **Site = extension source of truth for user-facing capabilities.** Any change to pause / thaw / rewind / volume / toolbar behavior must update the landing (hero / sub, toolbar sim with the expanded popup, and `site/freeze.zip` via `npm run build`) in the **same PR**. See [AGENTS.md](./AGENTS.md).

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

- `popup/` is the toolbar UI. It messages `src/background.js` (MV3 service worker).
- The worker runs `chrome.scripting.executeScript` against **all tabs, all frames**, injecting `src/media-controller.js`:
  - **Freeze:** pauses each playing media element and tags it with `data-freeze-paused="1"`.
  - **Thaw:** resumes only the tagged elements and clears the tag.
  - **Rewind:** sets `currentTime = 0` without changing play/pause.
  - **Volume:** one stored level applied to every reachable media element.
- Restricted pages (`chrome://`, the web store, etc.) are skipped gracefully.

## Scripts

| Command | Description |
| --- | --- |
| `npm run icons` | Regenerate PNG toolbar icons into `icons/`. |
| `npm run pack` | Build `dist/freeze.zip` (source only). |
| `npm run build` | Icons + zip. |

## Project layout

```
manifest.json        MV3 manifest (popup + commands)
src/background.js    service worker (messages + injection)
src/media-controller.js  page-frame freeze / thaw / rewind / volume
popup/               toolbar popup (Freeze, rewind, volume)
icons/               generated PNGs (idle + frozen variants)
scripts/             icon generator + zip packer (no deps)
site/                install/landing page + freeze.zip (deployed to Vercel)
```

## Notes & scope

- While frozen, newly started media in those tabs is paused.
- Fully local: no network, no tracking, no accounts.

## License

All Rights Reserved © Menhir Holdings

## Project tracking

Linear is the source of truth — see [STATUS.md](./STATUS.md) and [TODO.md](./TODO.md).
