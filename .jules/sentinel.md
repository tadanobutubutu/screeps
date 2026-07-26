## visual.effects.js PRNG Vulnerability

* **Vulnerability:** Unpredictable visual effects and PRNG predictability via `Math.random()`.
* **Fix:** Replaced `Math.random()` with `crypto.randomBytes()` via a custom `secureRandomFloat` function (falling back to `Math.random()` if `crypto` is unavailable) in `visual.effects.js`.

* **Review:** The vulnerability is fixed in `visual.effects.js`. The fix is thoroughly tested and preserves existing functionality. Tests correctly pass, format correctly passes, and lint is ignored as per instructions.
