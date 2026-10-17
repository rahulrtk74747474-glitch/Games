# TRAP THE THIEF

The default game is **index.html** — a complete mobile-first thinking game in one self-contained HTML file. Download and open it in a modern browser. No build, server, libraries, external fonts, assets or network connection are needed to play.

## Play in ten seconds

1. Tap an empty tile to place a barrier.
2. The thief recomputes his shortest escape route and moves one step.
3. Cut off **all** routes to the green exits to win. If any thief reaches an exit, you lose.

The gold dot marks his intended next step **before** your action; the dotted line shows his current route. Your barrier can change both. Permanent walls, occupied tiles, exits, gates and tunnels cannot receive barriers. Undo is unlimited and does not reduce stars. Retry starts the same puzzle again.

## 24 campaign cases

- Cases 1–7: barriers and alternate escape routes.
- Cases 8–12: paired tunnels; moving between endpoints takes one thief step.
- Cases 13–18: tap a power switch instead of placing a barrier to toggle gates. This uses one turn. A gate cannot close under a thief; an occupied switch cannot be activated.
- Cases 19–24: two thieves move simultaneously. Catch both; either escaping loses the case. Thieves can share a tile. A temporarily cut-off thief can move again if you reopen a route, so plan to contain both together.

Routes are deterministic breadth-first searches. Equal routes use up, right, down, left, then tunnel ordering. No timer, hidden dice rolls or adaptive enemy cheating.

Match or beat the displayed move target without hints for three stars. Within target +2 earns two; otherwise one. Using a hint caps the attempt at two stars. The target is a verified solution length, **not a claim of the mathematical minimum**. Previously earned best stars are retained.

Hints first use the verified solution where applicable, then a bounded search from your current position. If that search fails, the game says it did not find a short solution; it does not claim the puzzle is impossible.

## Daily challenge and saving

The UTC date deterministically selects from 132 individually verified board variants. Everyone using the same date gets the same puzzle. The finite pool can repeat. There is no server or global leaderboard.

LocalStorage saves unlocked cases, stars, best move counts, sound preference and your unfinished action sequence. Reloading replays the sequence to rebuild the board and undo history. Opening another case replaces the current unfinished attempt. Private browsing or storage restrictions can prevent persistence; failed writes show an on-screen notice.

Sound is optional and synthesized with WebAudio. Haptics run where supported. Reduced-motion preferences are respected. Downloaded HTML works offline; this is not an installable PWA or Android APK.

## Validation

```sh
node tests/trap-rules.test.cjs
npm install --no-save playwright
npx playwright install chromium
node tests/trap-browser.test.cjs
```

`CHROMIUM_EXECUTABLE` can point to an existing Chromium binary. `SCREENSHOT_DIR` sets the screenshot destination (defaults to the OS temporary directory).

Passed in this build:

- All 24 campaign winning certificates and 132 daily certificates.
- Deterministic route tie order, tunnel travel, gate toggling, occupied-gate safety, invalid actions and immutable rule state.
- All 24 cases played through the actual Chromium UI, all 72 stars, touch placement, daily win, hint, loss/undo recovery, save/reload and undo history.
- Mobile (360 and 390 px), tablet, landscape and desktop viewport checks. Phone and desktop screenshots were visually inspected.
- No JavaScript page errors and no external network requests during gameplay.

Physical-device vibration and speaker output were not tested.

## Previous games

The previous games remain available as `echo.html` and `sky-stack.html`; their tests target those files. The new game does not overwrite their saved progress keys.

## Code structure

All production code is in index.html: styling and semantic UI, pure Rules engine, verified puzzle data, persistence, rendering, turn control, hints and optional feedback. The regression tests are development tools, not runtime dependencies.
