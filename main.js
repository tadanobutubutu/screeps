// MIT License
// 
// Copyright (c) 2024 A2A Registry Authors
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const _ = require('lodash');

/**
 * Generates an accessible name for an SVG element based on its attributes.
 *
 * @param {Object} element - The SVG element object.
 * @returns {string} The accessible name.
 */
function getSvgAccessibleName(element) {
  if (!element || !element.attributes) {
    return '';
  }

  const attrs = element.attributes;

  if (attrs['aria-label']) {
    return attrs['aria-label'];
  }

  if (attrs['aria-labelledby']) {
    return attrs['aria-labelledby'];
  }

  if (attrs['title']) {
    return attrs['title'];
  }

  if (attrs['desc']) {
    return attrs['desc'];
  }

  return '';
}

/**
 * Sets a single attribute on an SVG element.
 *
 * @param {Object} element - The SVG element object.
 * @param {string} name - The attribute name.
 * @param {string} value - The attribute value.
 */
function setSvgAttribute(element, name, value) {
  if (!element || !element.attributes) {
    return;
  }
  element.attributes[name] = value;
}

/**
 * Sets multiple attributes on an SVG element.
 *
 * @param {Object} element - The SVG element object.
 * @param {Object} attributeMap - An object mapping attribute names to values.
 */
function setSvgAttributes(element, attributeMap) {
  if (!element || !attributeMap) {
    return;
  }

  if (!element.attributes) {
    element.attributes = {};
  }

  Object.keys(attributeMap).forEach((key) => {
    setSvgAttribute(element, key, attributeMap[key]);
  });
}

/**
 * Sets multiple attributes on multiple SVG elements.
 *
 * @param {Array} elements - Array of SVG element objects.
 * @param {Object} attributeMap - An object mapping attribute names to values.
 */
function setSvgAttributesArray(elements, attributeMap) {
  if (!Array.isArray(elements) || !attributeMap) {
    return;
  }

  elements.forEach((element) => {
    setSvgAttributes(element, attributeMap);
  });
}

/**
 * Validates that an element is a recognized landmark.
 *
 * @param {Object} element - The element to validate.
 * @returns {boolean} True if the element is a landmark.
 */
function validateLandmark(element) {
  if (!element || !element.tagName) {
    return false;
  }

  const validLandmarks = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
  return validLandmarks.includes(element.tagName.toLowerCase());
}

/**
 * Ensures an element has an ID attribute, generating one if needed.
 *
 * @param {Object} element - The element to check.
 * @returns {string} The element's ID.
 */
function ensureElementHasId(element) {
  if (!element) {
    return '';
  }

  if (!element.attributes) {
    element.attributes = {};
  }

  if (!element.attributes.id) {
    element.attributes.id = `auto-id-${Math.random().toString(36).slice(2, 11)}`;
  }

  return element.attributes.id;
}

/**
 * Adds an aria-label attribute to an element.
 *
 * @param {Object} element - The element to modify.
 * @param {string} label - The label text.
 */
function addAriaLabel(element, label) {
  if (!element) {
    return;
  }

  if (!element.attributes) {
    element.attributes = {};
  }

  element.attributes['aria-label'] = label;
}

/**
 * Checks if an element qualifies as a landmark element.
 *
 * @param {Object} element - The element to check.
 * @returns {boolean} True if the element is a landmark.
 */
function checkLandmarkElement(element) {
  return validateLandmark(element);
}

/**
 * Wraps primary content elements in a <main> landmark if not already wrapped.
 *
 * @param {Array} elements - Array of elements to process.
 * @returns {Array} The (possibly wrapped) elements.
 */
function wrapPrimaryContentInMain(elements) {
  if (!Array.isArray(elements)) {
    return elements;
  }

  const hasMain = elements.some((el) => el && el.tagName && el.tagName.toLowerCase() === 'main');

  if (hasMain) {
    return elements;
  }

  const mainWrapper = {
    tagName: 'main',
    attributes: { role: 'main' },
    children: elements,
  };

  return [mainWrapper];
}

/**
 * Checks the accessibility of landmark elements in a document.
 *
 * @param {Array} elements - Array of elements to inspect.
 * @returns {Object} Report object with counts and issues.
 */
function checkLandmarks(elements) {
  if (!Array.isArray(elements)) {
    return { total: 0, landmarks: 0, issues: ['invalid-input'] };
  }

  const landmarks = elements.filter((el) => validateLandmark(el));

  return {
    total: elements.length,
    landmarks: landmarks.length,
    issues: [],
  };
}

/**
 * Ensures that all landmark elements have unique identifying attributes.
 *
 * @param {Array} elements - Array of elements to process.
 */
function ensureUniqueLandmarks(elements) {
  if (!Array.isArray(elements)) {
    return;
  }

  const seenIds = new Set();

  elements.forEach((element) => {
    if (!validateLandmark(element)) {
      return;
    }

    ensureElementHasId(element);

    if (seenIds.has(element.attributes.id)) {
      element.attributes.id = `${element.attributes.id}-${Math.random().toString(36).slice(2, 6)}`;
    }

    seenIds.add(element.attributes.id);
  });
}

/**
 * Checks a list of elements for landmark validity and accessibility.
 *
 * @param {Array} elements - Array of elements to inspect.
 * @returns {Object} Aggregated landmark check report.
 */
function checkLandmarkElements(elements) {
  return checkLandmarks(elements);
}

// TODO: Implement the new function as described in the issue
function myNewFunction(input) {
  if (input === null || input === undefined) {
    return null;
  }
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
}

const main = {
  getSvgAccessibleName,
  setSvgAttribute,
  setSvgAttributes,
  setSvgAttributesArray,
  validateLandmark,
  ensureElementHasId,
  addAriaLabel,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  myNewFunction,
};

module.exports = main;
module.exports.default = main;