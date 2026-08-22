// main.js - Main entry point for the application

// This file needs to contain valid JavaScript

// New function to enhance accessibility (example)
function enhanceAccessibility(element) {
  if (element.hasAttribute) {
    element.setAttribute("aria-label", "Custom accessibility label");
  }
}

// Ensure the provided element is a string that can be converted to a DOM element
function ensureElement(input) {
  if (typeof input === "string") {
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
    return fetch(endpoint);
  }
};

// New function for making API calls using the imported API module
function makeApiCall(endpoint) {
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
  let mainElement = targetDoc.querySelector("main");

  if (!mainElement) {
    mainElement = targetDoc.createElement("main");
    const body = targetDoc.body || targetDoc.querySelector("body");
    if (body && body.firstChild) {
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

  const titleId = "svg-title-" + Math.random().toString(36).substr(2, 11);

  const titleEl = document.createElement("title");
  titleEl.id = titleId;
  titleEl.textContent = title || "";
  svgElement.insertBefore(titleEl, svgElement.firstChild);

  svgElement.setAttribute("aria-labelledby", titleId);

  if (description) {
    const descId = "svg-desc-" + Math.random().toString(36).substr(2, 11);
    const descEl = document.createElement("desc");
    descEl.id = descId;
    descEl.textContent = description;
    svgElement.insertBefore(descEl, svgElement.firstChild);

    const currentAriaLabelledby = svgElement.getAttribute("aria-labelledby") || "";
    svgElement.setAttribute("aria-labelledby", currentAriaLabelledby + " " + titleId + " " + descId);
  }
}

// REACT_036: Fix fake links by adding proper link behavior or role
function fixFakeLink(element, isActionLink) {
  if (!element) return;

  if (isActionLink) {
    element.setAttribute("role", "button");
  } else {
    if (element.tagName && element.tagName.toLowerCase() === "a") {
      if (!element.getAttribute("href")) {
        element.setAttribute("href", "#");
      }
    }
  }

  if (typeof element.setAttribute === "function") {
    element.setAttribute("tabindex", "0");
  }
}

// Helper function to fix all landmark issues in a container
function fixLandmarkIssues(container) {
  const targetDoc = container && container.querySelector ? container : document;
  const landmarks = targetDoc.querySelectorAll("header, nav, main, footer, aside, section");
  const seenLandmarks = {};

  landmarks.forEach(function(landmark) {
    const role = landmark.getAttribute("role") || landmark.tagName.toLowerCase();
    const label = landmark.getAttribute("aria-label") || "";
    const key = role + "-" + label;

    if (seenLandmarks[key]) {
      ensureUniqueLandmark(landmark, role, label + " " + (seenLandmarks[key]++));
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
  ...module.exports,

  setLangAttribute: setLangAttribute,
  addLandmarkRole: addLandmarkRole,
  ensureMainLandmark: ensureMainLandmark,
  ensureUniqueLandmark: ensureUniqueLandmark,
  addSvgAccessibleName: addSvgAccessibleName,
  fixFakeLink: fixFakeLink,
  fixLandmarkIssues: fixLandmarkIssues,
};