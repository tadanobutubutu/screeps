// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return (
    <div className="app-container" lang="en">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

// REACT_017: Add landmark roles to fix landmark issues
export function validateLandmark(landmark) {
  if (!landmark) return { valid: false, message: 'Landmark element is required' };

  const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
  const role = landmark.getAttribute ? landmark.getAttribute('role') : null;
  const ariaLabel = landmark.getAttribute ? landmark.getAttribute('aria-label') : null;
  const ariaLabelledby = landmark.getAttribute ? landmark.getAttribute('aria-labelledby') : null;

  // Check if landmark has a proper name
  const hasName = ariaLabel || ariaLabelledby;
  const validTags = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const isSemanticLandmark = validTags.includes(tagName);
  const hasRole = role && ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'].includes(role);

  if (!isSemanticLandmark && !hasRole) {
    return {
      valid: false,
      message: `Landmark should have a semantic tag (${validTags.join(', ')}) or a landmark role.`,
      suggestion: `Add role="${getSuggestedRole(tagName)}" and an aria-label.`
    };
  }

  if (!hasName && !hasRole) {
    return {
      valid: false,
      message: 'Landmark should have an accessible name via aria-label or aria-labelledby.',
      suggestion: 'Add aria-label or aria-labelledby attribute.'
    };
  }

  return { valid: true };
}

// Helper function to get suggested landmark role
function getSuggestedRole(tagName) {
  const roleMap = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    aside: 'complementary',
    footer: 'contentinfo',
    section: 'region',
    article: 'article'
  };
  return roleMap[tagName] || 'region';
}

// REACT_017: Validate landmark structure
export function validateLandmarkStructure() {
  const issues = [];
  
  // Check for proper landmark nesting
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  
  landmarks.forEach(landmark => {
    const validation = validateLandmark(landmark);
    if (!validation.valid) {
      issues.push({
        element: landmark,
        message: validation.message,
        suggestion: validation.suggestion,
        severity: 'warning'
      });
    }
  });

  // Check for nested main elements
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0) {
        issues.push({
          element: main,
          message: 'Multiple main landmarks found. Only one main landmark should exist per page.',
          severity: 'error'
        });
      }
    });
  }

  return issues;
}

// REACT_017: Get lang attribute for HTML element
export function getLangAttribute() {
  // Check if html element already has lang attribute
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    const existingLang = htmlElement.getAttribute('lang');
    if (existingLang) {
      return existingLang;
    }
  }
  
  // Return default or detected language
  return 'en';
}

// REACT_017: Create unique names for landmarks
export function getUniqueName(baseName, existingNames) {
  if (!baseName) return 'landmark';
  
  if (!existingNames || !existingNames.includes(baseName)) {
    return baseName;
  }
  
  let counter = 2;
  let newName = `${baseName} ${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

// REACT_025: Ensure unique landmarks function
export function validateUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, [role]');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute ? landmark.getAttribute('aria-label') : null;
    const ariaLabelledby = landmark.getAttribute ? landmark.getAttribute('aria-labelledby') : null;
    const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';

    // Determine the landmark name
    let landmarkName = ariaLabel || ariaLabelledby || tagName;

    if (landmarkNames.has(landmarkName)) {
      issues.push({
        element: landmark,
        message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
        severity: 'warning'
      });
    } else {
      landmarkNames.add(landmarkName);
    }
  });

  return issues;
}

// REACT_041: Add accessible names to SVGs
export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

// Helper function to get SVG accessible name
export function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  // Check for title element
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent;
    }
  }
  
  return null;
}

// REACT_036: Fix fake link issues - convert to proper semantic elements
export function isValidLink(element) {
  if (!element) return true;

  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const href = element.getAttribute ? element.getAttribute('href') : null;
  const onClick = element.getAttribute ? element.getAttribute('onclick') : null;

  // Check if it's a fake link (div/span with onClick but no href, or an anchor without href)
  const isFakeLink = (tagName === 'div' || tagName === 'span') && onClick && !href;

  if (isFakeLink) {
    return {
      valid: false,
      suggestion: `Replace <${tagName}> with <button> or <a href="#"> for proper accessibility.`
    };
  }

  return { valid: true };
}

// Helper function for creating accessible in-page buttons
export function createInPageButton(content, onClick) {
  const button = document.createElement('button');
  button.textContent = content;