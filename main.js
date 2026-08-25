import React from "react";
import ReactDOMServer from "react-dom/server";
import JSDOM from "jsdom";

// Import content modules for dependency graphs and index views
import { dependencyGraphContent } from "./dependencyGraphContent";
import { indexContent } from "./indexContent";

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----

// Add the following helper function at the end of the main.js file to create a mock React context
function createReactContext() {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>');
  const window = dom.window;

  window.React = React;
  window.ReactDOM = {
    renderToString: (component) => ReactDOMServer.renderToString(component)
  };

  const mockDocument = window.document;
  const body = mockDocument.body;
  body.innerHTML = "<div id='root'></div>";
  const rootElement = mockDocument.getElementById('root');
  window.document = mockDocument;
  window.navigator = { userAgent: "headless" };
  
  return {
    window,
    document: mockDocument,
    rootElement
  };
}

// Find the appropriate spot inside the addAriaLabelledbyIfNeeded function
// and integrate the required imports and new logic:

function addAriaLabelledbyIfNeeded(elem, context) {
  if (!elem) return;

  // ... (Pre-existing logic)

  // New logic: Render React components within the HTML element and extract them as strings
  if (!context) {
    context = createReactContext();
  }
  
  // Determine which content to render based on elem type or attributes
  let content;
  if (typeof elem === 'string') {
    content = React.createElement(elem, null);
  } else if (elem.getAttribute && elem.getAttribute('data-type') === 'dependency-graph') {
    content = dependencyGraphContent({ context });
  } else if (elem.getAttribute && elem.getAttribute('data-type') === 'index') {
    content = indexContent({ context });
  } else {
    content = React.createElement('div', { id: 'generatedId' }, null);
  }
  
  const contentString = ReactDOMServer.renderToString(content);
  
  // ... (Pre-existing logic)
}

// Modify the initAriaLabels function to have the context setup as a property,
// and use that context to render React components:

function initAriaLabels() {
  const elements = document.querySelectorAll('[aria-labelledby]');
  elements.forEach((elem) => {
    const id = elem.id || 'aria-label-' + Math.floor(Math.random() * 9);
    elem.id = id;
    const labels = elem.querySelectorAll('label');
    labels.forEach((label) => {
      elem.setAttribute('aria-label', label.textContent);
    });

    // New logic: Create a context, render a React component, and call addAriaLabelledbyIfNeeded
    const context = createReactContext();
    const content = React.createElement('div', { id: 'generatedId' }, null);
    addAriaLabelledbyIfNeeded(elem, context);
  });
}

/**
 * Wraps the primary content in a <main> element for semantic HTML structure.
 * This function finds the main content area and wraps it appropriately.
 * 
 * @param {Object} context - The React context containing window and document references
 * @returns {HTMLElement|null} - The created main element or null if no content found
 */
function wrapMainElement(context) {
  if (!context || !context.document) return null;
  
  const { document } = context;
  
  // Check if a main element already exists
  const existingMain = document.querySelector('main, [role="main"]');
  if (existingMain) {
    return existingMain;
  }
  
  // Find the primary content area (body or main content container)
  const body = document.body;
  if (!body || body.children.length === 0) {
    return null;
  }
  
  // Create a new main element
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  
  // Move all body children into the main element
  while (body.firstChild) {
    mainElement.appendChild(body.firstChild);
  }
  
  // Append the main element to the body
  body.appendChild(mainElement);
  
  return mainElement;
}

/**
 * Adds the lang attribute to the HTML element for accessibility (REACT_015).
 * 
 * @param {Object} context - The React context containing window and document references
 * @param {string} lang - The language code to set (e.g., 'en', 'es', 'fr')
 * @returns {HTMLElement|null} - The HTML element with lang attribute or null
 */
function addLangAttribute(context, lang = 'en') {
  if (!context || !context.document) return null;
  
  const { document } = context;
  const htmlElement = document.documentElement;
  
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
    return htmlElement;
  }
  
  return null;
}

/**
 * Fixes table structure issues for accessibility (REACT_027).
 * Ensures tables have proper headers, captions, and semantic structure.
 * 
 * @param {Object} context - The React context containing window and document references
 * @returns {number} - The number of table structure issues fixed
 */
function fixTableStructure(context) {
  if (!context || !context.document) return 0;
  
  const { document } = context;
  const tables = document.querySelectorAll('table');
  let issuesFixed = 0;
  
  tables.forEach((table) => {
    // Check if table has a caption
    let caption = table.querySelector('caption');
    if (!caption) {
      caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
      issuesFixed++;
    }
    
    // Check if table has a thead
    const thead = table.querySelector('thead');
    if (!thead && table.rows.length > 0) {
      const newThead = document.createElement('thead');
      newThead.appendChild(table.rows[0]);
      table.insertBefore(newThead, table.firstChild);
      issuesFixed++;
    }
    
    // Check if table has a tbody
    const tbody = table.querySelector('tbody');
    if (!tbody) {
      const allRows = Array.from(table.querySelectorAll('tr'));
      if (allRows.length > 0) {
        const newTbody = document.createElement('tbody');
        allRows.forEach((row) => {
          if (row.parentNode === table) {
            newTbody.appendChild(row);
          }
        });
        table.appendChild(newTbody);
        issuesFixed++;
      }
    }
    
    // Check if header cells have proper scope attributes
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((th) => {
      if (!th.getAttribute('scope')) {
        th.setAttribute('scope', 'col');
        issuesFixed++;
      }
    });
  });
  
  return issuesFixed;
}

// ----- END ORIGINAL CODE -----

// *** NEW FUNCTION ADDED AS REQUESTED IN ISSUE ***
/**
 * Determines the active language of the page content.
 * Analyzes text content to infer the most likely language.
 * 
 * @param {Object} context - The React context containing window and document references
 * @returns {string} - The detected language code (e.g., 'en', 'es', 'fr')
 */
function determineActiveLanguage(context) {
  if (!context || !context.document) return 'en';
  
  const { document } = context;
  const htmlElement = document.documentElement;
  
  // Check if lang attribute is already set on html element
  const existingLang = htmlElement ? htmlElement.getAttribute('lang') : null;
  if (existingLang) {
    return existingLang;
  }
  
  // Analyze text content to determine language
  const textContent = document.body ? document.body.textContent || '' : '';
  
  // Define language classifiers based on common words/phrases
  const languagePatterns = {
    en: ['the', 'and', 'is', 'in', 'to', 'of', 'for', 'with', 'on', 'at'],
    es: ['el', 'la', 'de', 'que', 'y', 'en', 'se', 'que', 'por', 'con'],
    fr: ['le', 'la', 'les', 'de', 'et', 'en', 'se', 'dans', 'pour', 'du']
  };
  
  const textLower = textContent.toLowerCase();
  let detectedLanguage = 'en';
  let maxScore = 0;
  
  Object.entries(languagePatterns).forEach(([lang, patterns]) => {
    const score = patterns.filter(word => 
      textLower.includes(word)
    ).length;
    
    if (score > maxScore) {
      maxScore = score;
      detectedLanguage = lang;
    }
  });
  
  return detectedLanguage;
}

/**
 * Applies accessibility improvements to all tables in the document.
 * Iterates through all tables and applies structural fixes for better accessibility.
 * 
 * @param {Object} context - The React context containing window and document references
 * @returns {number} - The total number of table structure issues fixed
 */
function applyTableAccessibility(context) {
  if (!context || !context.document) return 0;
  
  return fixTableStructure(context);
}

// Export all functions for external use
export {
  createReactContext,
  addAriaLabelledbyIfNeeded,
  initAriaLabels,
  wrapMainElement,
  addLangAttribute,
  fixTableStructure,
  determineActiveLanguage,
  applyTableAccessibility
};