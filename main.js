function enhanceAccessibility(element) {
  if (element.hasAttribute) {
    element.setAttribute("aria-label", "Custom accessibility label");
  }
}

function ensureElement(input) {
  if (typeof input === "string") {
    if (typeof document !== "undefined" && document.querySelector) {
      return document.querySelector(input);
    }
    return null;
  }
  return input;
}

const api = {
  callApi: function(endpoint) {
    return fetch(endpoint);
  }
};

function makeApiCall(endpoint) {
  return api.callApi(endpoint);
}

function setLangAttribute(lang, targetDoc) {
  const doc = targetDoc || document;
  if (doc.documentElement) {
    doc.documentElement.setAttribute("lang", lang || "en");
  }
}

function addLandmarkRole(element, landmarkType) {
  if (element && element.setAttribute) {
    element.setAttribute("role", landmarkType);
  }
}

function ensureUniqueLandmark(element, landmarkType, label) {
  if (element && element.setAttribute) {
    element.setAttribute("role", landmarkType);
    if (label) {
      element.setAttribute("aria-label", label);
    }
  }
}

function addSvgAccessibleName(svgElement, title, description) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== "svg") {
    return;
  }
  
  const titleId = "svg-title-" + Math.random().toString(36).substr(2, 9);
  const titleEl = document.createElementNS("http://www.w3.org/2000/svg", "title");
  titleEl.id = titleId;
  titleEl.textContent = title || "";
  svgElement.insertBefore(titleEl, svgElement.firstChild);
  
  svgElement.setAttribute("aria-labelledby", titleId);
  
  if (description) {
    const descId = "svg-desc-" + Math.random().toString(36).substr(2, 9);
    const descEl = document.createElementNS("http://www.w3.org/2000/svg", "desc");
    descEl.id = descId;
    descEl.textContent = description;
    svgElement.insertBefore(descEl, svgElement.firstChild);
    
    const currentAriaLabelledby = svgElement.getAttribute("aria-labelledby") || "";
    svgElement.setAttribute("aria-labelledby", titleId + " " + descId);
  }
}

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
  
  if (!element.getAttribute("tabindex")) {
    element.setAttribute("tabindex", "0");
  }
}

function fixLandmarkIssues(container) {
  const landmarks = container.querySelectorAll("[role]");
  const seenLandmarks = {};
  
  landmarks.forEach(function(landmark) {
    const role = landmark.getAttribute("role");
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

module.exports = {
  enhanceAccessibility: enhanceAccessibility,
  ensureElement: ensureElement,
  makeApiCall: makeApiCall,
  setLangAttribute: setLangAttribute,
  addLandmarkRole: addLandmarkRole,
  ensureUniqueLandmark: ensureUniqueLandmark,
  addSvgAccessibleName: addSvgAccessibleName,
  fixFakeLink: fixFakeLink,
  fixLandmarkIssues: fixLandmarkIssues
};