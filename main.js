// Add these imports at the top of main.js
import React from "react";
import ReactDOMServer from "react-dom/server";
import JSDOM from "jsdom";

// Import content modules for dependency graphs and index views
import { dependencyGraphContent } from "./dependencyGraphContent";
import { indexContent } from "./indexContent";

// ... (Pre-existing code)

// Add the following helper function at the end of the main.js file to create a mock React context
function createReactContext() {
  const { JSDOM: { window } } = JSDOM;

  window.React = React;
  window.ReactDOM = {
    renderToString: (component) => ReactDOMServer.renderToString(component)
  };

  const mockDocument = new window.Document();
  const body = mockDocument.body;
  body.innerHTML = "<div id='root'></div>";
  const rootElement = body.querySelector('#root');
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

function addAriaLabelledbyIfNeeded(elem) {
  if (!elem) return;

  // ... (Pre-existing logic)

  // New logic: Render React components within the HTML element and extract them as strings
  const context = createReactContext();
  
  // Determine which content to render based on elem type or attributes
  let content;
  if (elem.getAttribute && elem.getAttribute('data-view') === 'dependency-graph') {
    content = dependencyGraphContent({ context });
  } else if (elem.getAttribute && elem.getAttribute('data-view') === 'index') {
    content = indexContent({ context });
  } else {
    content = <div id="generatedId">{/* Your React component here */}</div>;
  }
  
  const contentString = ReactDOMServer.renderToString(content);
  
  // ... (Pre-existing logic)
}

// Modify the initAriaLabels function to have the context setup as a property,
// and use that context to render React components:

function initAriaLabels() {
  const elements = [];
  elements.forEach((elem) => {
    const id = elem.id || 'aria-label-' + Math.floor(Math.random() * 9);
    elem.id = id;
    const labels = elem.querySelectorAll('label');
    labels.forEach((label) => {
      elem.setAttribute('aria-label', label.textContent);
    });

    // New logic: Create a context, render a React component, and call addAriaLabelledbyIfNeeded
    const context = createReactContext();
    const content = <div id="generatedId">{/* Your React component here */}</div>;
    addAriaLabelledbyIfNeeded(elem);
  });
}

/**
 * Wraps the primary content in a <main> element for semantic HTML structure.
 * This function finds the main content area and wraps it appropriately.
 * 
 * @param {Object} context - The React context containing window and document references
 * @returns {HTMLElement|null} - The created main element or null if no content found
 */
function wrapPrimaryContentInMain(context) {
  if (!context || !context.document) return null;
  
  const { document } = context;
  
  // Check if a main element already exists
  const existingMain = document.querySelector('main');
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
  
  // Move all body children into the main element
  while (body.firstChild) {
    mainElement.appendChild(body.firstChild);
  }
  
  // Append the main element to the body
  body.appendChild(mainElement);
  
  return mainElement;
}

// Export the functions to make them accessible
export { createReactContext, addAriaLabelledbyIfNeeded, initAriaLabels, wrapPrimaryContentInMain, dependencyGraphContent, indexContent };