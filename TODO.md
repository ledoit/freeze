# TODO List

Linear is authoritative: [Freeze project](https://linear.app/menhir-holdings/project/freeze-brave-extension-5672687b-a2c6-42f9-a532-84197440a683).

## 1. Install landing restyle — [MT-210](https://linear.app/menhir-holdings/issue/MT-210) (In Review)

Frost-on-glass install page: folk split (copy left, live demo right), single Download CTA, 3-step load-unpacked. Preview on the PR.

**Verify:** `#freeze-demo` still freezes/thaws; `freeze.zip` downloads; Open Extensions copies `chrome://extensions` (or Brave/Edge equivalent).

## 2. Reliability + rewind — [MT-178](https://linear.app/menhir-holdings/issue/MT-178) (In Review)

- Verify Freeze all pauses across YouTube and another HTML5 media site.
- Verify media started/replaced after freezing is immediately paused.
- Verify Back to 0:00 preserves each media element's playing/paused state.

## 3. Thaw all = play all tabs — [MT-183](https://linear.app/menhir-holdings/issue/MT-183) (In Review)

Thaw all hits play on all reachable media in all tabs. [PR #7](https://github.com/menhir-holdings/freeze/pull/7).

## 4. Unified volume slider — [MT-182](https://linear.app/menhir-holdings/issue/MT-182) (In Review)

One popup slider sets volume together across all tabs. [PR #7](https://github.com/menhir-holdings/freeze/pull/7).
