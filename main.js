import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const existingFunction = () => {
  // ... existing implementation
};

// React Components
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 100"
    width="32"
    height="32"
  >
    <title>Application Favicon</title>
    {/* Existing SVG paths */}
  </svg>
);

const Layout = ({ children }) => (
  <div>
    <FaviconSVG />
    {children}
  </div>
);

// Accessibility Functions
const TH_WITHOUT_SCOPE_COL = /<th(?![^>]*\bscope=)(?![^>]*\bclass="[^"]*row-header[^"]*")[^>]*>/gi;
const TH_WITHOUT_SCOPE_ROW = /<th(?![^>]*\bscope=)(?![^>]*\bclass="[^"]*col-header[^"]*")[^>]*>/gi;

function addScopeToColumnHeaders(content) {
  return content.replace(TH_WITHOUT_SCOPE_COL, (match) => {
    if (match.includes('scope=')) return match;
    return match.replace(/^<th/, '<th scope="col"');
  });
}

function addScopeToRowHeaders(content) {
  return content.replace(TH_WITHOUT_SCOPE_ROW, (match) => {
    if (match.includes('scope=')) return match;
    return match.replace(/^<th/, '<th scope="row"');
  });
}

function fixTableHeadersAccessibility(content) {
  const thWithoutScope = /<th(?![^>]*\bscope=)[^>]*>/gi;
  return content.replace(thWithoutScope, (match) => {
    return match.replace(/^<th/, '<th scope="col"');
  });
}

function validateTableHeaders(content) {
  const thWithoutScope = /<th(?![^>]*\bscope=)[^>]*>/gi;
  return !thWithoutScope.test(content);
}

// Export all functions
export { existingFunction, Layout, FaviconSVG, 
         addScopeToColumnHeaders, 
         addScopeToRowHeaders, 
         fixTableHeadersAccessibility, 
         validateTableHeaders };

// Initialize app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Layout><App /></Layout>);