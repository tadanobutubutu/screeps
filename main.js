Sure thing—here’s a clean, single‑file `main.js` that pulls the useful parts from both sides of the conflict:

```js
'use strict';

/**
 * main.js – Screeps entry point and shared helpers.
 *
 * Combines configuration, runtime state, utility helpers and
 * (future) accessibility/UI support.  The original repo
 * separated user‑management logic into its own module; this
 * file focuses on the plumbing that everyone needs.
 */

/* --------------------------------------------------------------------- */
/* 1️⃣  Configuration helpers                                           */
/* --------------------------------------------------------------------- */
const config = {
  port:      process.env.PORT      || 3000,
  env:       process.env.NODE_ENV || 'development',
  apiUrl:    process.env.API_URL   || 'https://api.example.com',
  timeout:   Number(process.env.TIMEOUT) || 5000,
  debug:     process.env.NODE_ENV !== 'production',
  version:   '1.0.0',
};

// Browser: set default language
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = 'en';
}

/* --------------------------------------------------------------------- */
/* 2️⃣  Runtime state & common utilities