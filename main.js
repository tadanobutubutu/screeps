// main.js - Main entry point for the application

// This file needs to contain valid JavaScript

// New function to enhance accessibility (example)
function enhanceAccessibility(element) {
  // Accessible enhancement of the provided element
  // For example, adding ARIA attributes
  if (element.hasAttribute) {
    element.setAttribute("aria-label", "Custom accessibility label");
  }
}

// Ensure the provided element is a string that can be converted to a DOM element
function ensureElement(input) {
  if (typeof input === "string") {
    // Convert string selector to DOM element
    if (typeof document !== "undefined" && document.querySelector) {
      return document.querySelector(input);
    }
    return null;
  }
  return input;
}

// Import the required module for API calls
const api = {
  callApi: function(endpoint) {
    // Placeholder for API call implementation
    return fetch(endpoint);
  }
};

// New function for making API calls using the imported API module
function makeApiCall(endpoint) {
  // Example usage of the imported API module
  return api.callApi(endpoint);
}

// Accessibility utility functions to address insight report issues

// REACT_015: Set lang attribute on HTML element
function setLangAttribute(lang, targetDoc) {
  const doc = targetDoc || document;
  if (doc.documentElement) {
    doc.documentElement.lang = lang || "en";
  }
}

// REACT_017: Add landmark roles to elements
function addLandmarkRole(element, landmarkType) {
  if (element && element.setAttribute) {
    element.setAttribute("role", landmarkType);
  }
}

// REACT_017: Ensure main landmark exists for accessibility
function ensureMainLandmark(container) {
  const targetDoc = container && container.querySelector ? container : document;
  
  // Check if main landmark already exists
  let mainElement = targetDoc.querySelector("main");
  
  if (!mainElement) {
    // Create main landmark for accessibility
    mainElement = targetDoc.createElement("main");
    
    // Try to find the body or main content area to wrap
    const body = targetDoc.body || targetDoc.documentElement;
    if (body && body.firstChild) {
      // Move body children into main
      while (body.firstChild) {
        mainElement.appendChild(body.firstChild);
      }
      body.appendChild(mainElement);
    }
  }
  
  return mainElement;
}

// REACT_025: Ensure unique landmark by adding unique role/label combination
function ensureUniqueLandmark(element, landmarkType, label) {
  if (element && element.setAttribute) {
    element.setAttribute("role", landmarkType);
    if (label) {
      element.setAttribute("aria-label", label);
    }
  }
}

// REACT_041: Add accessible names to SVG elements
function addSvgAccessibleName(svgElement, title, description) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== "svg") {
    return;
  }

  // Generate unique IDs for accessibility
  const titleId = "svg-title-" + Math.random().toString(36).substr(2, 11);

  // Add title element for screen reader support
  const titleEl = document.createElement("title");
  titleEl.id = titleId;
  titleEl.textContent = title || "";
  svgElement.insertBefore(titleEl, svgElement.firstChild);

  // Link title to SVG with aria-labelledby
  svgElement.setAttribute("aria-labelledby", titleId);

  // Optionally add desc for more detail
  if (description) {
    const descId = "svg-desc-" + Math.random().toString(36).substr(2, 11);
    const descEl = document.createElement("desc");
    descEl.id = descId;
    descEl.textContent = description;
    svgElement.insertBefore(descEl, svgElement.firstChild);

    // Update aria-labelledby to include both title and description
    const currentAriaLabelledby = svgElement.getAttribute("aria-labelledby") || "";
    svgElement.setAttribute("aria-labelledby", currentAriaLabelledby + " " + titleId + " " + descId);
  }
}

// REACT_036: Fix fake links by adding proper link behavior or role
function fixFakeLink(element, isActionLink) {
  if (!element) return;

  if (isActionLink) {
    // Mark as button if it's an action, not navigation
    element.setAttribute("role", "button");
    // Also set aria-label if not already set for better screen reader experience
    if (!element.getAttribute("aria-label") && element.textContent) {
      element.setAttribute("aria-label", element.textContent.trim());
    }
  } else {
    // Ensure it's a proper anchor if it's a link
    if (element.tagName && element.tagName.toLowerCase() === "a") {
      // Already an anchor, just ensure it has href
      if (!element.getAttribute("href")) {
        element.setAttribute("href", "#");
      }
    }
  }

  // Add tabindex to make keyboard accessible
  if (typeof element.setAttribute === "function") {
    element.setAttribute("tabindex", "0");
  }
}

// REACT_036: Fix the rotate back fake link
function fixRotateBackLink(container) {
  const targetDoc = container && container.querySelector ? container : document;
  const rotateBackLink = targetDoc.querySelector(".rotate-back, [data-rotate-back]");
  
  if (rotateBackLink && rotateBackLink.tagName && rotateBackLink.tagName.toLowerCase() === "a") {
    // Check if it's a hash-only href (fake link)
    const href = rotateBackLink.getAttribute("href");
    if (href === "#" || href === "") {
      // This is an action link, not navigation - fix it
      fixFakeLink(rotateBackLink, true);
    }
  }
  
  return rotateBackLink;
}

// Helper function to fix all landmark issues in a container
function fixLandmarkIssues(container) {
  const targetDoc = container && container.querySelector ? container : document;
  const landmarks = targetDoc.querySelectorAll("main, footer, aside, section, header, nav");
  const seenLandmarks = {};

  landmarks.forEach(function(landmark) {
    const role = landmark.getAttribute("role") || landmark.tagName.toLowerCase();
    const label = landmark.getAttribute("aria-label") || "";

    const key = role + "-" + label;

    if (seenLandmarks[key]) {
      // Duplicate landmark found - make unique
      ensureUniqueLandmark(landmark, role, label + " " + seenLandmarks[key]++);
    } else {
      seenLandmarks[key] = 1;
    }
  });

  return seenLandmarks;
}

// Ensure the HTML element has a language attribute set for accessibility
setLangAttribute('en');

// Ensure main landmark exists for accessibility (REACT_017)
ensureMainLandmark();

// ADD THE MISSING EXPORT STATEMENT FOR THE FIXED FUNCTIONS
module.exports = {
  // Existing exports preserved unchanged

  // New accessibility functions
  setLangAttribute: setLangAttribute,
  addLandmarkRole: addLandmarkRole,
  ensureMainLandmark: ensureMainLandmark,
  ensureUniqueLandmark: ensureUniqueLandmark,
  addSvgAccessibleName: addSvgAccessibleName,
  fixFakeLink: fixFakeLink,
  fixRotateBackLink: fixRotateBackLink,
  fixLandmarkIssues: fixLandmarkIssues,

  // Added back missing exports
  enhanceAccessibility: enhanceAccessibility,
  ensureElement: ensureElement,
  makeApiCall: makeApiCall,
  api: api,
};