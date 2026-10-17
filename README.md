# SKY STACK

The new default game is **index.html**: a single-file, offline, one-tap arcade game. Download the file and open it in a browser. No packages, server, images or network requests are needed to play.

## How to play

Tap **Let's build**, then tap the play area (or press Space) when the moving block lines up with the tower. Overhang falls away and the next block becomes narrower. Miss the tower and the run ends. Tap **One more tower** to retry immediately.

- Each successful placement adds one floor.
- A drop within 6 world pixels for the first five floors, then 4 pixels, snaps perfectly.
- Three consecutive perfect drops restore 18 pixels of width, up to the starting width.
- Speed increases with height, up to a cap. There is no timer; let a block pass and try again.
- Skyline, moon, stars, beveled blocks, falling pieces and particles are drawn procedurally.
- Personal best and sound preference save in localStorage when available.
- Sound is off by default; tap the musical note to enable synthesized effects.
- Pause with the pause button or P; switching away from the tab auto-pauses.
- Score sharing uses native sharing or clipboard, with a visible text fallback.

Touch, mouse and keyboard work. Reduced-motion preference disables decorative particles, flash and shake. The moving block remains animated because timing is the core mechanic. Offline play uses the downloaded file; this is not an installable PWA.

The earlier ECHO strategy game is preserved as **echo.html**.

## Validation

```sh
node tests/sky-stack.test.cjs
node tests/sky-runtime.test.cjs
```

Both passed: overlap/cut invariants, perfect tolerance, misses, syntax, 12-floor sequence, combo progression, pause gating, retry and record persistence. Runtime tests use browser-interface stubs; they do not verify actual device rendering, haptic feedback or audio. Real-browser visual verification remains outstanding.

ECHO's older tests now target echo.html. They are separate from SKY STACK.
