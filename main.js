/* ==========================================================================
 * main.js - Screeps / Node.js – merged entry point
 *
 * 1️⃣  Configuration helpers (original HEAD content)
 * 2️⃣  User‑management helpers + accessibility/UI utilities
 *
 * All public symbols are exported via `module.exports` so the rest of the
 * Screeps codebase can pick and choose.
 * ------------------------------------------------------------------------ */

// Set default language – updated by the HEAD change request
document.documentElement.lang = 'en';  // <-- replace this if you prefer another locale

// -------------------------------------------------------------------------
// 1️⃣  Configuration helpers
// -------------------------------------------------------------------------
const config = {
  port:   process.env.PORT      || 3000,
  env:    process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL   || 'https://api.example.com',
  timeout: Number(process.env.TIMEOUT) || 5000,
  debug:  process.env.NODE_ENV !== 'production',
  version: '1.0.0',
};

// -------------------------------------------------------------------------
// 2️⃣  App state & common utilities
// -------------------------------------------------------------------------
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
};

const hello = () => 'Hello from main.js';
const getVersion = () => config.version;
const getConfig = () => ({ ...config });

const calculateDifference = (a, b) => a - b;
const calculateProduct    = (a, b) => a * b;
const isNumber            = (value) => typeof value === 'number' && !isNaN(value);
const clamp              = (value, min, max) => Math.min(Math.max(value, min), max);

// -------------------------------------------------------------------------
// 3️⃣  Accessibility helpers
// -------------------------------------------------------------------------

/**
 * Guesses an accessible name for an SVG element.
 *
 * The function tries the following strategies in order:
 *   1. aria-label attribute
 *   2. title element inside the SVG
 *   3. viewBox attribute
 *
 * @param {Element} svgElement
 * @returns {string|null}
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName !== 'svg') return null;

  // 1) aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.trim();

  // 2) <title>
  const title = svgElement.querySelector('title');
  if (title && title.textContent) return title.textContent.trim();

  // 3) viewBox (fallback)
  const viewBox = svgElement.getAttribute('viewBox');
  if (viewBox) return `svg with viewBox ${viewBox}`;

  return null;
}

/**
 * Handles “fake” links – anchors that don't actually navigate anywhere.
 *
 * By default this just logs a warning, but if you need custom handling
 * (e.g., add an onClick that does nothing, or remove the anchor)
 * replace this body.
 *
 * @param {HTMLAnchorElement} link
 */
function handleFakeLinks(link) {
  console.warn(`Fake link detected: <a href="${link.getAttribute('href')}">`, link);
  // Example: prevent default behavior
  link.addEventListener('click', (e) => e.preventDefault());
}

/**
 * Renders dependency graphs with optional accessibility support.
 *
 * @param {Array<Element>} svgElements – SVG elements to process
 */
function renderDependencyGraphs(svgElements) {
  svgElements.forEach((svg) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      // For the sake of this demo we just log the name – replace with
      // actual rendering logic if needed.
      console.log(`Rendering graph "${accessibleName}"`);
    } else {
      console.log('Rendering unnamed graph (accessibility hint missing)');
    }
  });
}

/**
 * Validates all <a> elements on the page for accessibility.
 *
 * Detects fake links and ensures all anchors have meaningful hrefs.
 * Logs a message for each issue found.
 */
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const isFakeLink =
      !href ||
      href.trim() === '' ||
      href === '#' ||
      href.startsWith('javascript:');

    if (isFakeLink) {
      handleFakeLinks(link);
    } else {
      // Further checks could be added here (e.g., broken link detection)
      console.debug(`Valid link found: ${href}`);
    }
  });
}

// -------------------------------------------------------------------------
// 4️⃣  Exported API
// -------------------------------------------------------------------------
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
  getSvgAccessibleName,
  handleFakeLinks,
  renderDependencyGraphs,
  validateLinkAccessibility,
};