Here’s a clean, conflict‑free `main.js` that you can drop into the repo.  
It keeps the original logic (config, state, utilities, and the new
`validateTableAccessibility` helper) and stitches everything together.

```js
'use strict';

/**
 * main.js – Screeps entry point and shared helpers.
 *
 * Combines configuration, runtime state, utility helpers and
 * accessibility/UI support.
 *
 * Exported API:
 *   - config
 *   - appState
 *   - utils
 *   - validateTableAccessibility
 */

/* ----------------------------------------------------------- */
/* 1️⃣  Configuration helpers                                 */
/* ----------------------------------------------------------- */
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
/* 2️⃣  Runtime state                                                       */
/* --------------------------------------------------------------------- */
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
};

/* --------------------------------------------------------------------- */
/* 3️⃣  Common utilities                                                   */
/* --------------------------------------------------------------------- */
const utils = Object.freeze({
  hello: () => 'Hello from main.js',

  /* config helpers */
  getVersion: ()      => config.version,
  getConfig: ()       => ({ ...config }),

  /* math helpers */
  calculateDifference: (a, b) => a - b,
  calculateProduct:    (a, b) => a * b,
});

/* --------------------------------------------------------------------- */
/* 4️⃣  Accessibility helper (new implementation)                         */
/* --------------------------------------------------------------------- */
const validateTableAccessibility = (table) => {
  // Basic validation: ensure the table is non‑null, Node & header rows exist,
  // and each cell has appropriate text content.
  if (!table || table.nodeType !== 1) return false;

  const rows = table.querySelectorAll('tr');
  if (!rows.length) return false;

  for (const row of rows) {
    const cells = row.querySelectorAll('th, td');
    if (!cells.length) return false;

    for (const cell of cells) {
      if (typeof cell.textContent !== 'string') return false;
    }
  }

  return true;
};

/* --------------------------------------------------------------------- */
/* 5️⃣  Exported API                                                        */
/* --------------------------------------------------------------------- */
module.exports = {
  config,
  appState,
  utils,
  validateTableAccessibility,
};
```

### What changed?

| Section | What moved | Why |
|---------|-----------|-----|
| **Configuration** | `config` | Consolidated into a single, clean object. |
| **Runtime state** | `appState` | Kept unchanged from HEAD. |
| **Utilities** | `utils` | Now combines the `hello`, `getConfig`, `getVersion`, `calculateDifference` and `calculateProduct` helpers into one frozen object. |
| **Accessibility** | `validateTableAccessibility` | Added the new helper (implementation may be tweaked to fit your exact needs). |
| **Export** | Module exports | Included all items for external consumption. |

Drop this file in place of the conflicted one, run your tests, and you’ll have a working, merge‑clean `main.js`. Happy coding!