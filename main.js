'use strict';

/*=========================================
  main.js – Screeps entry point
  ------------------------------------------
  Combines configuration, runtime state,
  utility helpers, and accessibility checks.
  ==========================================*/
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
const hello = () => 'Hello from main.js';
const getVersion = () => config.version;
const getConfig = () => ({ ...config });

const isNumber = (value) =>
  typeof value === 'number' && !Number.isNaN(value);

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

const calculateDifference = (a, b) => a - b;
const calculateProduct = (a, b) => a * b;

const utils = Object.freeze({
  hello,
  getVersion,
  getConfig,
  calculateDifference,
  calculateProduct,
});

/* --------------------------------------------------------------------- */
/* 4️⃣  Accessibility helpers                                           */
/* --------------------------------------------------------------------- */
const getLangAttribute = () => 'en';
const getFullLangAttribute = () => 'en-US';

const addLangAttribute = (element) => {
  if (element && typeof element === 'object' && 'lang' in element) {
    element.lang = getFullLangAttribute();
  }
  return element;
};

const validateTableAccessibility = (table) => {
  const issues = [];

  if (!table) {
    issues.push('Table is null or undefined');
    return { success: false, issues };
  }

  if (!(table instanceof HTMLTableElement)) {
    issues.push('Not an HTMLTableElement');
    return { success: false, issues };
  }

  if (!table.querySelector