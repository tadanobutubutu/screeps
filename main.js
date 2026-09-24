/*==================================================
  main.js – Screeps entry point
  --------------------------------------------------
  A tidy version that stitches the old HEAD
  implementation with the new strict‑mode layout
  from the pull‑request.  All helper modules are
  exported at the bottom for use elsewhere in the
  repository or in your Screeps scripts.
===================================================*/

'use strict';

/*==================================================
  1️⃣  Configuration helpers
  --------------------------------------------------
  All environment‑aware defaults are kept
  and the version string is exported for
  debugging or telemetry.
===================================================*/
const config = {
  port:      process.env.PORT      || 3000,
  env:       process.env.NODE_ENV  || 'development',
  apiUrl:    process.env.API_URL   || 'https://api.example.com',
  timeout:   Number(process.env.TIMEOUT) || 5000,
  debug:     process.env.NODE_ENV !== 'production',
  version:   '1.0.0',
};

/*==================================================
  2️⃣  Runtime state
  --------------------------------------------------
  Lightweight state container. The cache
  is a Map so you can attach anything.
===================================================*/
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
};

/*==================================================
  3️⃣  Common utilities
  --------------------------------------------------
  A grab‑bag of small helpers used in the
  game logic.  Nothing fancy – pure JS.
===================================================*/
const hello = () => 'Hello from main.js';
const getVersion = () => config.version;
const getConfig = () => ({ ...config });

const isNumber = value =>
  typeof value === 'number' && !Number.isNaN(value);

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

const calculateDifference = (a, b) => a - b;
const calculateProduct = (a, b) => a * b;

/*==================================================
  4️⃣  Accessibility helpers
  --------------------------------------------------
  Basic internationalisation + table checks.
  Intended for use in client‑side scripts.
===================================================*/
const getLangAttribute = () => 'en';
const getFullLangAttribute = () => 'en-US';

const addLangAttribute = element => {
  if (element && typeof element === 'object' && 'lang' in element) {
    element.lang = getLangAttribute();
  }
};

/**
 * Example table‑checker.  In this minimal demo it
 * simply ensures `table` has a header row.  
 * In a real Screeps environment you might hook
 * into the DOM or your own data‑structures instead.
 */
const hasHeader = table => Array.isArray(table) && table.length > 0 && Array.isArray(table[0]);

/*==================================================
  5️⃣  Exported API
  --------------------------------------------------
  Export everything you want to surface to the
  rest of the repo.  The Screeps runtime imports
  only what it needs, so keep the surface
  intentionally small.
===================================================*/
module.exports = {
  config,
  appState,
  hello,
  getVersion,
  getConfig,
  isNumber,
  clamp,
  calculateDifference,
  calculateProduct,
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  hasHeader,
};