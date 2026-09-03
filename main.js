const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const accessiblyHelper = require('./accessibly-helper');

// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->
// _Commit: e1060a659ba0acd8f70570301019d02d1d671c81_

function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

/**
 * Adds SVG accessibility props to an element
 * @param {SVGElement} element - The SVG element to add accessibility props to
 * @param {Object} props - Accessibility properties object
 * @returns {SVGElement} The element with accessibility props added
 */
function addSvgAccessibilityProps(element, props) {
  if (!element || typeof element.setAttribute !== 'function') {
    return element;
  }

  // Add aria-label if provided
  if (props && props.ariaLabel) {
    element.setAttribute('aria-label', props.ariaLabel);
  }

  // Add role if provided (use 'img' for decorative graphics, 'graphics-document' for complex graphics)
  if (props && props.role) {
    element.setAttribute('role', props.role);
  } else {
    // Default role for SVG graphics
    element.setAttribute('role', 'img');
  }

  // Add focusable="false" to prevent keyboard navigation issues
  element.setAttribute('focusable', 'false');

  // Add tabindex="-1" to improve keyboard accessibility
  element.setAttribute('tabindex', '-1');

  // Add title for basic accessibility (will be used as tooltip)
  if (props && props.title) {
    const titleElement = element.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleElement.textContent = props.title;
    
    // Insert title as first child
    if (element.firstChild) {
      element.insertBefore(titleElement, element.firstChild);
    } else {
      element.appendChild(titleElement);
    }
  }

  // Add desc for description if provided
  if (props && props.description) {
    const descElement = element.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'desc');
    descElement.textContent = props.description;
    
    // Insert desc after title
    if (element.firstChild && element.firstChild.tagName === 'title') {
      element.insertBefore(descElement, element.firstChild.nextSibling);
    } else {
      element.insertBefore(descElement, element.firstChild);
    }
  }

  // Apply any additional accessibility props using accessiblyHelper
  if (props && accessiblyHelper && typeof accessiblyHelper.applyProps === 'function') {
    accessiblyHelper.applyProps(element, props);
  }

  return element;
}

module.exports = {
  UserSafety: 'unsafe',
  getUserSafetyAdvice,
  addSvgAccessibilityProps
};

// TODO: Implement this function for adding SVG accessibility props