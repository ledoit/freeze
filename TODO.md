# TODO List

Linear is authoritative: [Freeze project](https://linear.app/menhir-holdings/project/freeze-brave-extension-5672687b-a2c6-42f9-a532-84197440a683).

## 1. Landing lockstep — [MT-232](https://linear.app/menhir-holdings/issue/MT-232) (In Review)

Site = extension SoT. Hard rule in [AGENTS.md](./AGENTS.md). This branch ships the toolbar **popup** with Freeze / tagged thaw / all-tabs volume / rewind to 0:00. Hero / sub / sim must match `src/` + `popup/` + `site/freeze.zip`.

**Verify:** left column stays short (hero + install, no capabilities list); right sim is Chromium toolbar + HTML5 video tabs **with the expanded popup hanging off the flake**; Freeze pauses playing videos; thaw resumes only Freeze-paused; volume moves all demo videos together; Back to 0:00 resets `currentTime` and keeps play/pause; ice-blue ❄ while frozen; `freeze.zip` still downloads.

## 2. Reliability + rewind — [MT-178](https://linear.app/menhir-holdings/issue/MT-178) (In Review)

Rewind + freeze-while-frozen now also live on the MT-232 preview ([PR #10](https://github.com/menhir-holdings/freeze/pull/10)). [PR #6](https://github.com/menhir-holdings/freeze/pull/6) remains open — do not merge blindly.

## 3. Thaw all = play all tabs — [MT-183](https://linear.app/menhir-holdings/issue/MT-183) (In Review)

Thaw-plays-everything is **not** in the MT-232 zip. [PR #7](https://github.com/menhir-holdings/freeze/pull/7) still open.

## 4. Unified volume slider — [MT-182](https://linear.app/menhir-holdings/issue/MT-182) (In Review)

All-tabs volume now also lives on the MT-232 preview. [PR #7](https://github.com/menhir-holdings/freeze/pull/7) still open.
