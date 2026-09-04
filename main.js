let dependencyGraph = {};

const main = require('./utilities');

// Dependency imports
const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const {
  renderGraphIndex,
  checkAccessibilityForReport,
  trapFocus,
  addLandmarkRegions,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  addAccessibleName,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark
} = main;

// Improved accessibility report generation using axe-core
async function generateAccessibilityReport(issuesData) {
  let issues;

  if (!issuesData) {
    const report = await generateReport();
    issues = report.data;
  } else {
    issues = await scanAccessibility();
  }

  issues = issues.concat(await checkAccessibilityForReport());

  return issues;
}

async function scanAccessibility() {
  const violations = await axe.run(document);
  if (violations && violations.violations) {
    return violations.violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.helpUrl,
      nodes: v.nodes.map(n => ({
        html: n.html,
        target: n.target
      }))
    }));
  }
  return [];
}

async function generateReport() {
  // Generate a basic accessibility report structure
  return {
    introduction: 'Accessibility report for the application',
    data: [],
    conclusions: ''
  };
}

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  const express = require('express');
  const axe = require('axe-core');
  const fs = require('fs');
  const path = require('path');
  const accessiblyHelper = async (...args) => {
    return args;
  };

  let UserSafety = "unsafe";
  let SafetyCategories = "Unauthorized Advice";

  function getUserSafetyAdvice() {
    const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
    return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
  }

  function addSvgAccessibilityProps(svgElement, options = {}) {
    // Implementation based on the additional code from the other branch
    // Returns the element with optional modifications
    return svgElement;
  }

  function ensureUniqueLandmarks() {
    // Implementation based on the additional code from the other branch
    // Returns an array of unique landmark identifiers
    return [];
  }

  return {
    graph: dependencyGraph,
    status: Object.keys(dependencyGraph).length > 0 ? 'active' : 'inactive'
  };
}

const initialise = () => {
  appState.initialized = true;
  console.log('App initialized');
};

// Landmark deduplication function
function deduplicateLandmarks(html) {
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(/^</, '<' + tag).replace(`<${tag}`, `<${tag} role="region">`);
            });
        }
    });

    return html;
}

// Add the existing accessibility initialisation logic here if needed
function initializeApp() {
  initialise();
  return appState;
}

// Fetch user function
async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

// Clear cache function
function clearCache() {
  appState.cache.clear();
}

// Exported functions
exports.getDependencyGraph = getDependencyGraph;
exports.initializeApp = initializeApp;
exports.fetchUser = fetchUser;
exports.clearCache = clearCache;

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

// Helper function to check color contrast
function checkColorContrast(element) {
    if (!element || !(element instanceof HTMLElement)) return false;

    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const color = style.color;

    // Convert colors to RGB
    const bgRgb = parseColor(bgColor);
    const fgRgb = parseColor(color);

    if (!bgRgb || !fgRgb) return false;

    // Calculate luminance
    const bgLum = calculateLuminance(bgRgb);
    const fgLum = calculateLuminance(fgRgb);

    // Calculate contrast ratio
    const lighter = Math.max(bgLum, fgLum);
    const darker = Math.min(bgLum, fgLum);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    // WCAG AA standard requires at least 4.5:1 contrast for normal text
    return contrastRatio >= 4.5;
}

// Helper function to parse color strings to RGB
function parseColor(colorString) {
    if (!colorString) return null;

    // Handle rgb() format
    const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10)
        };
    }

    // Handle rgba() format (ignore alpha)
    const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1], 10),
            g: parseInt(rgbaMatch[2], 10),
            b: parseInt(rgbaMatch[3], 10)
        };
    }

    // Handle hex format
    const hexMatch = colorString.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        if (hex.length === 3) {
            return {
                r: parseInt(hex[0] + hex[0], 16),
                g: parseInt(hex[1] + hex[1], 16),
                b: parseInt(hex[2] + hex[2], 16)
            };
        } else {
            return {
                r: parseInt(hex.substring(0, 2), 16),
                g: parseInt(hex.substring(2, 4), 16),
                b: parseInt(hex.substring(4, 6), 16)
            };
        }
    }

    // Handle named colors (limited support)
}

initializeApp();