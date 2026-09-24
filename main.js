Here’s a single, clean `main.js` that merges both branches without the conflict markers.  
It preserves the browser‑language fallback, the shared **config**, a lightweight **appState**, and the full set of utility helpers.

```js
'use strict';

/**
 * main.js – Screeps entry point and shared helpers.
 *
 * Combines configuration, runtime state, utility helpers and
 * (future) accessibility/UI support.
 *
 * Exported API:
 *   - config
 *   - appState
 *   - utils
 */

const config = {
  port:      process.env.PORT      || 3000,
  env:       process.env.NODE_ENV  || 'development',
  apiUrl:    process.env.API_URL   || 'https://api.example.com',
  timeout:   Number(process.env.TIMEOUT) || 5000,
  debug:     process.env.NODE_ENV !== 'production',
  version:   '1.0.0',
};

/* --------------------------------------------------------------------- */
/* 1️⃣  Browser: set default language (only in a browser context)        */
/* --------------------------------------------------------------------- */
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = 'en';
}

/* --------------------------------------------------------------------- */
/* 2️⃣  Runtime state                                                   */
/* --------------------------------------------------------------------- */
const appState = {
  initialized: false,
  data:        null,
  cache:       new Map(),
};

/* --------------------------------------------------------------------- */
/* 3️⃣  Common utilities                                               */
/* --------------------------------------------------------------------- */
const utils = Object.freeze({
  hello: () => 'Hello from main.js',

  /* config helpers */
  getVersion: ()      => config.version,
  getConfig: ()       => ({ ...config }),

  /* math helpers */
  calculateDifference: (a, b) => a - b,
  calculateProduct:    (a, b) => a * b,

  /* type helpers */
  isNumber: value =>
    typeof value === 'number' && !Number.isNaN(value),

  clamp: (v, min, max) => Math.max(min, Math.min(max, v)),

  /* placeholder for new implementation (to be filled in by devs) */
  validateTableAccessibility: table => {
    if (!Array.isArray(table) || table.length === 0) return false;
    // Basic sanity: all items must be accessible to the browser
    return table.every(item => item.accessible === true);
  },
});

/* --------------------------------------------------------------------- */
/* 4️⃣  Exported module                                                 */
/* --------------------------------------------------------------------- */
module.exports = {
  config,
  appState,
  utils,
  // Silent re‑exports for legacy code
  getConfig: utils.getConfig,
  getVersion: utils.getVersion,
  hello: utils.hello,
};

```

The file now:

- keeps the same configuration as before,
- retains the browser‐language fallback,
- exposes both `appState` and the utility helpers under a single `utils` namespace,
- leaves a placeholder `validateTableAccessibility` for the new feature discussed in the merge, and
- avoids any of the merge marker noise.

Feel free to tweak or extend the utilities and state as the project evolves!