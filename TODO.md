# TODO List

Linear is authoritative: [Freeze project](https://linear.app/menhir-holdings/project/freeze-brave-extension-5672687b-a2c6-42f9-a532-84197440a683).

## 1. Landing lockstep — [MT-232](https://linear.app/menhir-holdings/issue/MT-232) (In Review)

Site = extension SoT for user-facing capabilities. Hard rule in [AGENTS.md](./AGENTS.md). Hero / sub / toolbar sim must match `src/` on this branch (toolbar freeze/thaw only — no rewind, volume, popup, mixer, or capabilities list).

**Verify:** left column does not scroll a feature list; right sim is Chromium toolbar + HTML5 video tabs; freeze pauses playing videos and shows ice-blue ❄; thaw resumes only Freeze-paused; `freeze.zip` still downloads.

## 2. Reliability + rewind — [MT-178](https://linear.app/menhir-holdings/issue/MT-178) (In Review)

- Verify Freeze all pauses across YouTube and another HTML5 media site.
- Verify media started/replaced after freezing is immediately paused.
- Verify Back to 0:00 preserves each media element's playing/paused state.
- When this ships, update landing hero / sub and the toolbar sim in the same PR ([AGENTS.md](./AGENTS.md)).

## 3. Thaw all = play all tabs — [MT-183](https://linear.app/menhir-holdings/issue/MT-183) (In Review)

Thaw all hits play on all reachable media in all tabs. [PR #7](https://github.com/menhir-holdings/freeze/pull/7). Same-PR site copy required.

## 4. Unified volume slider — [MT-182](https://linear.app/menhir-holdings/issue/MT-182) (In Review)

One popup slider sets volume together across all tabs. [PR #7](https://github.com/menhir-holdings/freeze/pull/7). Same-PR site copy required.
