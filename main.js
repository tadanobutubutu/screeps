import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

function function3() {
  // TODO: Implement new function3 logic here
}

function addProperLandmarkRegions(landmarks) {
  // Implement your new function to add proper landmark regions
  // This is a placeholder implementation, replace it with the actual logic
  landmarks.forEach(landmark => {
    // Assuming landmark has a 'name' and 'coordinates' property
    // You would add the logic to properly add the landmark region here
    console.log(`Adding landmark region for: ${landmark.name} at coordinates: ${landmark.coordinates}`);
  });
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers, captions, and structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed table structures
 */
export function fixTableStructureIssues(html) {
  if (typeof html !== 'string') return html;

  let result = html;

  // Fix tables that need proper scope attributes on headers
  result = result.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });

  // Ensure tables have associated caption or summary
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('summary=') || attrs.includes('caption')) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });

  // Ensure proper thead/tbody structure
  result = result.replace(/(<tr[^>]*>)/gi, (match, attrs) => {
    // Check if tbody already exists before this tr
    const trIndex = result.indexOf(match);
    const beforeTr = result.substring(0, trIndex);
    if (beforeTr && !beforeTr.includes('<tbody') && !beforeTr.includes('</tbody>')) {
      return `<tbody>${match}`;
    }
    return match;
  });

  // Close tbody tags that aren't properly closed
  const tableMatches = result.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/i.test(table);
    const hasTbody = /<tbody/i.test(table);
    const hasTfoot = /<tfoot/i.test(table);

    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && !/<tbody>[\s\S]*<\/tbody>/i.test(table)) {
        result = result.replace(table, table.replace(/(<tbody[^>]*>)([\s\S]*?)(<\/table>)/i, '$1<tbody>$2</tbody>$3'));
      }
    }
  });

  // Add main landmark to HTML for proper document structure
  export function addMainLandmark(html) {
    if (typeof html !== 'string') return html;

    // Check if main landmark already exists
    if (/<main[\s>]/i.test(html)) {
      return html;
    }

    // Try to match body content
    const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const bodyAttrs = bodyMatch[1];
      const bodyContent = bodyMatch[2];
      const wrappedContent = `<main>${bodyContent}</main>`;
      return html.replace(/<body[^>]*>[\s\S]*<\/body>/i, wrappedContent);
    }

    return html;
  }

  // Ensure unique landmarks
  export function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
    const counters = {};

    // Initialize counters for each landmark type
    landmarks.forEach(lm => {
      const regex = new RegExp(`<${lm}\\b`, 'gi');
      const matches = html.match(regex);
      if (matches) {
        counters[lm] = matches.length;
      }
    });

    // First, ensure only one <main> landmark exists.
    // Convert subsequent <main> elements to <section> with aria-label.
    let mainSeen = false;
    html = html.replace(/<main([^>]*)>/gi, (match, attrs) => {
      if (!mainSeen) {
        mainSeen = true;
        return match;
      }
      // Replace additional <main> tags with <section> while preserving any attributes
      const safeAttrs = attrs || '';
      // Avoid duplicating an aria-label if one already exists
      if (safeAttrs.includes('aria-label=') || safeAttrs.includes('aria-labelledby=')) {
        return `<section${safeAttrs}>`;
      }
      return `<section${safeAttrs} aria-label="Content section">`;
    });

    // Recompute counters after main -> section conversion
    landmarks.forEach(lm => {
      const regex = new RegExp(`<${lm}([^>]*)>`, 'gi');
      html = html.replace(regex, (match, attrs) => {
        if (attrs && attrs.includes('id=')) {
          return match;
        }
        const count = (counters[lm] || 0) + 1;
        counters[lm] = count;
        return `<${lm}${attrs} id="${lm}-${count}">`;
      });
    });

    return html;
  }

  export { addProperLandmarkRegions };

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

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

export function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName}-${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }
  return newName;
}

export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll(
    '[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer'
  );

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  if (!document.documentElement.hasAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }

  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

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

export function isValidLink(element) {
  // ... existing code ...
}

export function addScopeToHeaders(tableElement) {
  // ... existing code ...
}

function addressAccessibilityIssues(insightReport) {
  insightReport.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    // TODO: Implement solution to the issue
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

module.exports = {
  fetchData,
  App,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  function3
};