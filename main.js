**main.js – Screeps, Node.js merged entry point**

```js
'use strict';

/**
 * main.js – Screeps, Node.js – merged entry point
 *
 * This file hosts two independent feature sets:
 *
 * 1️⃣  Configuration helpers and app state
 * 2️⃣  User‑management helpers + accessibility / UI utilities
 */

const config = {
  port:   process.env.PORT      || 3000,
  env:    process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL   || 'https://api.example.com',
  timeout: Number(process.env.TIMEOUT) || 5000,
  debug:  process.env.NODE_ENV !== 'production',
  version: '1.0.0',
};

// Default language (update if you need another locale)
document.documentElement.lang = 'en';

// -------------------------------------------------------------------------
// 1️⃣  Configuration helpers
// -------------------------------------------------------------------------

// (All helpers already live in `config`)

// -------------------------------------------------------------------------
// 2️⃣  App state & common utilities
// -------------------------------------------------------------------------

const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
};

const hello        = () => 'Hello from main.js';
const getVersion   = () => config.version;
const getConfig    = () => ({ ...config });

const calculateDifference = (a, b) => a - b;
const calculateProduct    = (a, b) => a * b;
const isNumber          = (value) => typeof value === 'number' && !Number.isNaN(value);
const clamp             = (value, min, max) => Math.min(Math.max(value, min), max);

// -------------------------------------------------------------------------
// 3️⃣  Accessibility helpers
// -------------------------------------------------------------------------

const getUserLocale = () => navigator.language || 'en-US';

const focusElement = (el) => {
  if (el && typeof el.focus === 'function') {
    el.focus();
  }
};

const alertMessage = (msg, type = 'info') => {
  console[type](msg);
};

// Expose all publicly‑used symbols
module.exports = {
  config,
  appState,
  hello,
  getVersion,
  getConfig,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  getUserLocale,
  focusElement,
  alertMessage,
  document, // expose so the entry point can use it, if needed
};
```