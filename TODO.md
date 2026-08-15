# TODO List

Linear is authoritative: [Freeze project](https://linear.app/menhir-holdings/project/freeze-brave-extension-5672687b-a2c6-42f9-a532-84197440a683).

## 1. Reliability + rewind — [MT-178](https://linear.app/menhir-holdings/issue/MT-178) (In Progress)

- Verify one left-click pauses across YouTube and another HTML5 media site.
- Verify media started/replaced after freezing is immediately paused.
- Verify Thaw resumes only Freeze-tagged media.
- Verify right-click → Back to 0:00 preserves each media element's playing/paused state.
- Load the rebuilt `dist/freeze.zip` in Brave and smoke-test keyboard shortcuts.

## 2. Public landing — [MT-119](https://linear.app/menhir-holdings/issue/MT-119) (Backlog → In Progress)

`https://freeze.menhir-holdings.com` currently returns **403** (Vercel Authentication / Deployment Protection).

**Manual fix:** Vercel → project **freeze** → Settings → Deployment Protection → disable Vercel Authentication on Production (or restrict to Preview only).

**Verify:** cold load shows install page + `freeze.zip` download without login redirect.
