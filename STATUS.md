# Freeze — Status

**As of:** 2026-09-18  
**SoT:** Linear — Freeze

## Shipped

- MV3 extension: freeze/thaw across tabs (MT-117)
- Toolbar icons, `npm run build` → `dist/freeze.zip` (MT-114)
- Install landing + zip at `site/` (MT-118)
- Landing redesign, bundled zip, All Rights Reserved ([PR #3](https://github.com/ledoit/freeze/pull/3))
- SSO protection off; CNAME in stonehenge `docs/DNS.md` (MT-119 **Done**)
- Install landing restyle (MT-210 · [PR #8](https://github.com/ledoit/freeze/pull/8))
- Snowflake favicon (MT-228 · [PR #9](https://github.com/ledoit/freeze/pull/9))

**Live:** [freeze-lilac.vercel.app](https://freeze-lilac.vercel.app) · [freeze.koalasalmon.com](https://freeze.koalasalmon.com)

## In review

| Issue | What |
|-------|------|
| MT-232 | Landing lockstep — this PR’s zip **ships the popup** (tagged freeze/thaw, all-tabs volume, rewind to 0:00) and the right-hand sim is that panel. [PR #10](https://github.com/ledoit/freeze/pull/10) |
| MT-183 | Thaw all plays every tab — still [PR #7](https://github.com/ledoit/freeze/pull/7). Overlaps MT-232 popup chrome; **not** adopted here (tagged thaw stays). |
| MT-182 | Unified volume slider — engine + landing now on MT-232 preview; [PR #7](https://github.com/ledoit/freeze/pull/7) still open. |
| MT-178 | Reliability + rewind-all — rewind + freeze controller now on MT-232 preview; [PR #6](https://github.com/ledoit/freeze/pull/6) still open. |

See [TODO.md](./TODO.md).
