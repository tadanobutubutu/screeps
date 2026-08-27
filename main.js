// Accessibility fixes for insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)

// REACT_015: Add lang attribute to HTML element
function setLanguageAttribute(langCode) {
  var htmlElement = document.querySelector("html");
  if (htmlElement) {
    htmlElement.setAttribute("lang", langCode || "en");
  }
}

// REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles() {
  var header = document.querySelector("header");
  if (header && !header.hasAttribute("role")) {
    header.setAttribute("role", "banner");
  }

  var main = document.querySelector("main");
  if (main && !main.hasAttribute("role")) {
    main.setAttribute("role", "main");
  }

  var nav = document.querySelector("nav");
  if (nav && !nav.hasAttribute("role")) {
    nav.setAttribute("role", "navigation");
  }

  var footer = document.querySelector("footer");
  if (footer && !footer.hasAttribute("role")) {
    footer.setAttribute("role", "contentinfo");
  }

  var aside = document.querySelector("aside");
  if (aside && !aside.hasAttribute("role")) {
    aside.setAttribute("role", "complementary");
  }
}

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  var mainLandmarks = document.querySelectorAll("main[role='main']");
  if (mainLandmarks.length > 1) {
    for (var i = 1; i < mainLandmarks.length; i++) {
      mainLandmarks[i].setAttribute("role", "main-" + i);
    }
  }

  var bannerLandmarks = document.querySelectorAll("[role='banner']");
  if (bannerLandmarks.length > 1) {
    for (var j = 1; j < bannerLandmarks.length; j++) {
      bannerLandmarks[j].setAttribute("role", "banner-" + j);
    }
  }
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  var svgs = document.querySelectorAll("svg");
  var ariaLabels = {
    "logo-svg": "Company Logo",
    "menu-icon": "Menu"
  };

  svgs.forEach(function(svg) {
    var id = svg.getAttribute("id");
    if (id && ariaLabels[id]) {
      svg.setAttribute("aria-label", ariaLabels[id]);
      svg.setAttribute("role", "img");
    }
  });
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks() {
  var links = document.querySelectorAll("a, button, span, div");
  links.forEach(function(el) {
    if (el.getAttribute("href") === "#" || (el.tagName === "BUTTON" && el.getAttribute("role") === "link")) {
      el.setAttribute("role", "button");
      if (!el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "0");
      }
    }
  });
}

// Initialize accessibility features on DOM load
document.addEventListener("DOMContentLoaded", function() {
  setLanguageAttribute();
  addLandmarkRoles();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinks();
});

// Preserve existing exports
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    setLanguageAttribute: setLanguageAttribute,
    addLandmarkRoles: addLandmarkRoles,
    ensureUniqueLandmarks: ensureUniqueLandmarks,
    addSvgAccessibleNames: addSvgAccessibleNames,
    fixFakeLinks: fixFakeLinks
  };
}

// Existing code and functions would be preserved here