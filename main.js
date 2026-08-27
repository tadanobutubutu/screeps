// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';

// Accessibility helper functions

/**
 * Gets the lang attribute for the HTML element based on the current locale
 * @returns {string} Language code (e.g., 'en', 'es', 'fr')
 */
export function getLangAttribute() {
  const locale = document.documentElement.getAttribute('data-locale') || 'en';
  return locale.split('-')[0];
}

/**
 * Validates and ensures the HTML element has a lang attribute
 * @param {HTMLElement} element - The HTML element to validate
 * @returns {Object} Validation result with success status and details
 */
export function validateHtmlLangAttribute(element) {
  const lang = element ? element.getAttribute('lang') : document.documentElement.getAttribute('lang');
  const validLangs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar'];
  
  if (!lang) {
    return { 
      success: false, 
      issue: 'REACT_015', 
      message: 'HTML element is missing lang attribute' 
    };
  }
  
  const langCode = lang.split('-')[0];
  if (!validLangs.includes(langCode)) {
    return { 
      success: false, 
      issue: 'REACT_015', 
      message: `Invalid language code: ${lang}` 
    };
  }
  
  return { success: true, lang };
}

/**
 * Validates table accessibility requirements
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with accessibility issues
 */
export function validateTableAccessibility(table) {
  const issues = [];
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td, th');
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({ 
      code: 'REACT_027', 
      type: 'missing_caption',
      message: 'Table is missing a caption element' 
    });
  }
  
  // Check if tables have proper header associations
  if (headers.length === 0) {
    issues.push({
      code: 'REACT_027',
      type: 'missing_headers',
      message: 'Table has no header cells (th elements)'
    });
  }
  
  // Check for scope attributes on headers
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      issues.push({
        code: 'REACT_027',
        type: 'missing_scope',
        message: `Header at index ${index} is missing scope attribute`
      });
    }
  });
  
  return {
    success: issues.length === 0,
    issueCount: issues.length,
    issues
  };
}

/**
 * Validates table structure for proper accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation result with structure issues
 */
export function validateTableStructure(table) {
  const issues = [];
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    issues.push({
      code: 'REACT_027',
      type: 'missing_thead',
      message: 'Table is missing thead element'
    });
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    issues.push({
      code: 'REACT_027',
      type: 'missing_tbody',
      message: 'Table is missing tbody element'
    });
  }
  
  // Check proper row structure
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push({
        code: 'REACT_027',
        type: 'empty_row',
        message: `Row at index ${index} has no cells`
      });
    }
  });
  
  return {
    success: issues.length === 0,
    issueCount: issues.length,
    issues
  };
}

/**
 * Validates landmark regions on the page
 * @param {Document|Element} root - The root element to search within
 * @returns {Object} Validation result with landmark issues
 */
export function validateLandmark(root = document) {
  const issues = [];
  const landmarks = root.querySelectorAll('[role], header, nav, main, footer, aside');
  
  // Check for main landmark
  const mainElements = root.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    issues.push({
      code: 'REACT_017',
      type: 'missing_main',
      message: 'Page is missing a main landmark'
    });
  }
  
  // Check for navigation landmarks
  const navElements = root.querySelectorAll('nav, [role="navigation"]');
  if (navElements.length === 0) {
    issues.push({
      code: 'REACT_017',
      type: 'missing_nav',
      message: 'Page is missing a navigation landmark'
    });
  }
  
  // Check for header/banner landmark
  const headerElements = root.querySelectorAll('header, [role="banner"]');
  if (headerElements.length === 0) {
    issues.push({
      code: 'REACT_017',
      type: 'missing_header',
      message: 'Page is missing a header/banner landmark'
    });
  }
  
  // Check for footer/contentinfo landmark
  const footerElements = root.querySelectorAll('footer, [role="contentinfo"]');
  if (footerElements.length === 0) {
    issues.push({
      code: 'REACT_017',
      type: 'missing_footer',
      message: 'Page is missing a footer/contentinfo landmark'
    });
  }
  
  return {
    success: issues.length === 0,
    issueCount: issues.length,
    issues
  };
}

/**
 * Validates landmark structure for accessibility
 * @param {Document|Element} root - The root element to search within
 * @returns {Object} Validation result with landmark structure issues
 */
export function validateLandmarkStructure(root = document) {
  const issues = [];
  
  // Check for proper landmark nesting
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = root.querySelectorAll(landmark);
    elements.forEach((el, index) => {
      // Check if landmark has an accessible name
      const hasLabel = el.getAttribute('aria-label') || 
                       el.getAttribute('aria-labelledby') || 
                       el.querySelector('h1, h2, h3, h4, h5, h6');
      
      if (!hasLabel && landmark !== 'main') {
        issues.push({
          code: 'REACT_017',
          type: 'unnamed_landmark',
          message: `${landmark} landmark at index ${index} lacks an accessible name`
        });
      }
    });
  });
  
  return {
    success: issues.length === 0,
    issueCount: issues.length,
    issues
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string|null} The accessible name or null if not found
 */
export function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  
  // Check role attribute
  const role = svg.getAttribute('role');
  if (role) return `SVG icon: ${role}`;
  
  return null;
}

/**
 * Ensures SVG elements have accessible names
 * @param {Document|Element} root - The root element to search within
 * @returns {Object} Validation result with SVG accessibility issues
 */
export function validateSvgAccessibility(root = document) {
  const issues = [];
  const svgs = root.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      issues.push({
        code: 'REACT_041',
        type: 'missing_accessible_name',
        message: `SVG at index ${index} lacks an accessible name`
      });
    }
  });
  
  return {
    success: issues.length === 0,
    issueCount: issues.length,
    issues
  };
}

/**
 * Validates that landmarks are unique (no duplicate landmark roles)
 * @param {Document|Element} root - The root element to search within
 * @returns {Object} Validation result with duplicate landmark issues
 */
export function validateUniqueLandmarks(root = document) {
  const issues = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  
  landmarkRoles.forEach(role => {
    const elements = root.querySelectorAll(`[role="${role}"], ${role === 'navigation' ? 'nav' : role === 'main' ? 'main' : role}`);
    const uniqueCount = new Set(Array.from(elements).map(el => el.getAttribute('id') || el.getAttribute('aria-label') || Math.random())).size;
    
    // Check for multiple instances of same landmark type
    const count = elements.length;
    if (count > 1 && (role === 'main' || role === 'banner' || role === 'contentinfo')) {
      issues.push({
        code: 'REACT_025',
        type: 'duplicate_landmark',
        message: `Found ${count} ${role} landmarks, expected 1`
      });
    }
  });
  
  return {
    success: issues.length === 0,
    issueCount: issues.length,
    issues
  };
}

/**
 * Creates an accessible in-page button
 * @param {Object} props - Button properties
 * @returns {JSX.Element} Accessible button element
 */
export function createInPageButton({ label, onClick, icon, className = '' }) {
  return (
    <button
      type="