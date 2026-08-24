# Freeze — Status

**As of:** 2026-08-24
**SoT:** [Linear — Freeze](https://linear.app/menhir-holdings/project/freeze-brave-extension-5672687b-a2c6-42f9-a532-84197440a683)

## Shipped

- MV3 extension: one-click freeze/thaw media across all tabs ([MT-117](https://linear.app/menhir-holdings/issue/MT-117))
- Toolbar icons (idle + frozen), state badge, `npm run build` → `dist/freeze.zip` ([MT-114](https://linear.app/menhir-holdings/issue/MT-114))
- Install landing + demo at `site/` ([MT-118](https://linear.app/menhir-holdings/issue/MT-118))
- Landing redesign, bundled zip download, All Rights Reserved ([PR #3](https://github.com/menhir-holdings/freeze/pull/3))
- Vercel SSO deployment protection disabled on `freeze` project

**Live:** [freeze-lilac.vercel.app](https://freeze-lilac.vercel.app)  
**Canonical (pending DNS):** [freeze.menhir-holdings.com](https://freeze.menhir-holdings.com) — add Cloudflare CNAME `freeze` → `cname.vercel-dns.com` (see [stonehenge DNS](https://github.com/menhir-holdings/stonehenge/blob/main/docs/DNS.md))

## In flight

| Issue | What |
|-------|------|
| [MT-183](https://linear.app/menhir-holdings/issue/MT-183) | Thaw all plays every tab (not only freeze-tagged media) |
| [MT-182](https://linear.app/menhir-holdings/issue/MT-182) | Unified volume slider for all tabs |
| [MT-178](https://linear.app/menhir-holdings/issue/MT-178) | Freeze reliability, persistent page controller, and rewind-all action in the popup |
| [MT-119](https://linear.app/menhir-holdings/issue/MT-119) | Cloudflare CNAME for `freeze` subdomain (Vercel domain + SSO fix done) |

## Backlog

None.

See [TODO.md](./TODO.md).
