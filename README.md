# ECHO

A complete offline strategy game in **index.html**. Download the file and open it in a modern browser. No server, build, library, font, image or audio download is required. On Android, open the downloaded HTML with a browser that supports local HTML files. Hosting it as a static page also works, but offline use is guaranteed by the downloaded file, not by a service worker.

## Play

Choose a unit and tap an empty cell. There are eight turns. Echo moves first each turn; the timeline exposes every move and board ghosts show future placement turns. Control more cells after turn eight to win. Ties end the streak. There is no forced timer; aim for 60–90 seconds.

- **Blade:** captures orthogonally adjacent enemy units once on placement.
- **Wall:** immune to capture and Mirror displacement. Counts as one cell.
- **Seed:** becomes a Blade at the beginning of placement turn +2 and captures once. Ownership changes preserve its timer. Seeds placed on turns 7–8 will not mature, but still count.
- **Mirror:** flips the nearest eligible enemy across the vertical board axis, retaining ownership. Destination must be empty; Walls and centre-column units are ineligible. Manhattan distance, then row-major cell index breaks ties. No eligible target means no effect.

All Seeds due on a turn mature simultaneously before the Echo placement. Both sides use identical rules. An Echo placement on an occupied cell fizzles rather than silently moving elsewhere. Captures change ownership, retain unit type, and do not chain. Mirrors do not trigger moved units' placement effects.

## Modes and progression

The request contains two different replay policies, so both are explicit modes:

- **Classic:** your previous eight placements become the next Echo, reflected left/right, whether you won or lost. This is the default.
- **Apex:** your highest-cell winning run across modes is retained as champion. Equal scores retain the earlier plan. This is a skill-based proxy, not a guarantee of strictly increasing difficulty.
- **Daily:** UTC date seeds a fixed eight-move plan, the same for every player, with local best margin. Retries allowed; no global leaderboard.
- **Friend:** import a checksummed 22-character code to fight a reflected run. A code represents a plan, not proof of score.

Streaks are per mode; personal best is the maximum. Abandoning an unfinished round resets its streak. Rewards: 25 base XP for wins, 10 otherwise, capped streak multiplier and an 18% cosmetic-only +15 XP bonus. Each 100 XP advances a level. Streak 2 unlocks Amber, 4 unlocks Prism glyphs, 7 unlocks Ice. Sound starts off and can be enabled. Reduced motion is respected; unsupported vibration/audio safely degrade.

Versioned localStorage saves progression and unfinished rounds. Private browsing or browsers that deny file storage may prevent persistence; the UI reports failed writes. Clearing browser data removes local progress. Daily dates use the device clock. All gameplay is local; codes can be sent through any messaging app.

## Implementation order

The single file contains numbered sections: 1. pure rules engine, 2. rendering, 3. immutable Echo replay and code format, 4. UI/progression, 5. procedural audio/particles/haptics. State/persistence is separated between rules and rendering.

## Development checks

The delivered game has zero dependencies. Optional browser regression tests use Node and Playwright:

```sh
node tests/rules.test.cjs
npm install --no-save playwright
npx playwright install chromium
node tests/echo.test.cjs
```

Coverage: orthogonal capture, Wall immunity, occupied replay blocking, Seed timing, Mirror reflection, daily determinism, code validation, full round, reward persistence, Classic replay, active-round resume, and viewport overflow.

## Five balance experiments

1. Limit Walls to two per round to reduce safe-cell spam.
2. Give Seeds a one-cell shield until bloom if their two-turn delay is too punishing.
3. Alternate first mover by turn, keeping the order visible, to measure Echo's first-move advantage.
4. Restrict Mirror range to two cells if global flips dominate positioning.
5. Evaluate Apex champions by wins against several fixed test plans instead of raw cell count.

These are experiments, not current rules. Measure win rate, unit selection, abandoned rounds and replay frequency before changing them.

Validation in the build environment: pure rule checks and 1,000 simulated rounds passed. A temporary DOM harness also passed full-round play, results, reward persistence, next-round replay, friend import and reload. The real-browser suite is provided but could not run because the Chromium download was unavailable; device rendering, audio and haptics still need hands-on verification.
