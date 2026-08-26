// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

// REACT_015: Add lang attribute to HTML element
function setHtmlLang(lang = "en") {
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.setAttribute("lang", lang);
  }
}

// REACT_017: Add landmark roles and fix landmark issues
function applyLandmarkRoles() {
  if (typeof document === "undefined") return;
  const header = document.querySelector("header");
  if (header && !header.getAttribute("role")) {
    header.setAttribute("role", "banner");
  }
  const nav = document.querySelector("nav");
  if (nav && !nav.getAttribute("role")) {
    nav.setAttribute("role", "navigation");
  }
  const main = document.querySelector("main");
  if (main && !main.getAttribute("role")) {
    main.setAttribute("role", "main");
  }
  const footer = document.querySelector("footer");
  if (footer && !footer.getAttribute("role")) {
    footer.setAttribute("role", "contentinfo");
  }
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames(names = {}) {
  if (typeof document === "undefined") return;
  const svgs = document.querySelectorAll("svg");
  let i = 0;
  svgs.forEach((svg) => {
    if (!svg.getAttribute("aria-label") && !svg.getAttribute("aria-labelledby")) {
      const name = names[i] || `Decorative icon ${i + 1}`;
      svg.setAttribute("aria-label", name);
      svg.setAttribute("role", "img");
    }
    i += 1;
  });
}

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  if (typeof document === "undefined") return;
  const landmarks = document.querySelectorAll("nav, main, header, footer, aside");
  const seen = {};
  landmarks.forEach((el, idx) => {
    const tag = el.tagName.toLowerCase();
    if (seen[tag] !== undefined) {
      el.setAttribute("aria-label", `${tag} ${idx + 1}`);
    } else {
      seen[tag] = idx;
    }
  });
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks() {
  if (typeof document === "undefined") return;
  const fakes = document.querySelectorAll('[role="link"], a.fake-link');
  fakes.forEach((el) => {
    if (el.tagName.toLowerCase() !== "a") {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "link");
    }
  });
}

// REACT_027: Ensure scope on <th> elements
function ensureThScope() {
  if (typeof document === "undefined") return;
  const ths = document.querySelectorAll("th");
  ths.forEach((th) => {
    if (!th.hasAttribute("scope")) {
      const row = th.parentElement;
      const isFirstRow = row && row.parentElement && row.parentElement.tagName.toLowerCase() === "thead";
      th.setAttribute("scope", isFirstRow ? "col" : "row");
    }
  });
}

// Run all accessibility fixes
function runAccessibilityFixes(options = {}) {
  setHtmlLang(options.lang || "en");
  applyLandmarkRoles();
  addSvgAccessibleNames(options.svgNames || {});
  ensureUniqueLandmarks();
  fixFakeLinks();
  ensureThScope();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    setHtmlLang,
    applyLandmarkRoles,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    ensureThScope,
    runAccessibilityFixes,
  };
}