import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// Initial setup
const app = createRoot(document.getElementById('root'));
document.documentElement.lang = 'en';

// Improve accessibility
app.setAttribute('role', 'main');
app.setAttribute('aria-label', 'Main application');

// New function as per the issue
function getUniqueLandmarkName(landmarkName) {
  // This function generates a unique name for landmarks based on the input name
  return `landmark-${landmarkName.replace(/\s+/g, '-').toLowerCase()}`;
}

// Assuming there's a way to retrieve landmarks, you would call the function like this:
// const allLandmarks = getLandmarks(); // Placeholder function
// ...

/**
 * REACT_015: Add lang attribute to HTML element
 * This is already done by setting document.documentElement.lang = 'en'; at the beginning
 */

/**
 * REACT_017: Add landmark roles and fix landmark issues
 * Assuming landmarks is an array of objects with 'name' and 'coordinates' properties
 */
function addLandmarkRoles(landmarks) {
  landmarks.forEach(landmark => {
    const element = document.getElementById(getUniqueLandmarkName(landmark.name));
    if (element) {
      element.setAttribute('role', 'landmark');
      element.setAttribute('aria-label', landmark.name);
    }
  });
}

/**
 * REACT_036: Fix 1 fake link issue
 * Detects elements that appear to be links but don't have valid href attributes
 */
function detectFakeLinks(container = document) {
  const fakeLinks = [];
  const clickableElements = container.querySelectorAll('a:not([href]), [role="link"]:not(a)');
  
  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchorWithoutHref = tagName === 'a' && !element.getAttribute('href');
    
    if (isAnchorWithoutHref || element.getAttribute('role') === 'link') {
      fakeLinks.push({
        element,
        tagName,
        text: element.textContent.trim().substring(0, 50),
        hasHref: tagName === 'a' ? !!element.getAttribute('href') : null,
        role: element.getAttribute('role'),
        issue: 'Fake link detected - element looks like a link but lacks proper href'
      });
    }
  });
  
  return fakeLinks;
}

/**
 * REACT_036: Fix a fake link by adding proper href or converting to button
 */
function fixFakeLink(element, fixType = 'button') {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  
  if (fixType === 'button' && tagName === 'a') {
    element.setAttribute('role', 'button');
    element.removeAttribute('href');
    return true;
  }
  
  if (fixType === 'href' && tagName === 'a' && !element.getAttribute('href')) {
    element.setAttribute('href', '#');
    return true;
  }
  
  if (fixType === 'button' && element.getAttribute('role') === 'link') {
    element.setAttribute('role', 'button');
    return true;
  }
  
  return false;
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 */
function addSvgAccessibleNames(container = document) {
  const svgs = container.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  const results = [];
  
  svgs.forEach((svg, index) => {
    const existingTitle = svg.querySelector('title');
    
    if (!existingTitle) {
      const title = document.createElement('title');
      title.id = `svg-title-${index}-${Date.now()}`;
      title.textContent = `SVG graphic ${index + 1}`;
      
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      
      svg.setAttribute('aria-labelledby', title.id);
      
      results.push({
        svg,
        titleId: title.id,
        status: 'added'
      });
    } else {
      results.push({
        svg,
        titleId: existingTitle.id || null,
        status: 'existing'
      });
    }
  });
  
  return results;
}

// <!--- Any other modifications or additions go here --->

export {
  function3,
  App,
  getUniqueLandmarkName,
  addLandmarkRoles,
  ...
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  announceToScreenReader,
  trapFocus,
  manageFocusOnNavigation,
  prefersReducedMotion,
  setAriaExpanded,
  hasAccessibleName,
  myFunction,
  newFunction,
  detectFakeLinks,
  fixFakeLink,
  addSvgAccessibleNames
};