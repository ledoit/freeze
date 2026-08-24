# TODO List

Linear is authoritative: [Freeze project](https://linear.app/menhir-holdings/project/freeze-brave-extension-5672687b-a2c6-42f9-a532-84197440a683).

## 1. Reliability + rewind — [MT-178](https://linear.app/menhir-holdings/issue/MT-178) (In Review)

- Verify Freeze all pauses across YouTube and another HTML5 media site.
- Verify media started/replaced after freezing is immediately paused.
- Verify Back to 0:00 preserves each media element's playing/paused state.
- Load the rebuilt `dist/freeze.zip` in Brave and smoke-test `Alt+Shift+F` / `Alt+Shift+0`.

## 2. Thaw all = play all tabs — [MT-183](https://linear.app/menhir-holdings/issue/MT-183) (In Progress)

Thaw all hits play on all reachable media in all tabs, not only Freeze-tagged media.

**Verify:** paused-before-freeze tabs start on thaw; YouTube + a second HTML5 site; shortcut `Alt+Shift+F` matches the popup.

## 3. Unified volume slider — [MT-182](https://linear.app/menhir-holdings/issue/MT-182) (In Progress)

One popup slider sets volume together across all tabs (persisted in `chrome.storage`).

**Verify:** two tabs with media move together; new/replaced media pick up the current level; 0% mutes.
