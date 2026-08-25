import React from 'react';

const indexModule = require('./index');

const VERSION = '1.0.0';

function init() {
  return 'initialized';
}

function processData(data) {
  return data;
}

function validate(data) {
  return Boolean(data);
}

function transform(input) {
  return input;
}

// Accessibility: Helper function to ensure SVG elements have accessible names
function ensureSvgAccessibleNames(svgContent) {
  if (!svgContent || typeof svgContent !== 'string') {
    return svgContent;
  }
  
  const hasAriaLabel = /aria-label\s*=/i.test(svgContent);
  const hasAriaLabelledby = /aria-labelledby\s*=/i.test(svgContent);
  const hasTitleElement = /<title[^>]*>/i.test(svgContent);
  const hasHiddenAttribute = /aria-hidden\s*=\s*["']true["']/i.test(svgContent);
  
  if (hasAriaLabel || hasAriaLabelledby || hasTitleElement || hasHiddenAttribute) {
    return svgContent;
  }
  
  const titleMatch = svgContent.match(/<title[^>]*>([^<]*)<\/title>/i);
  const titleText = titleMatch ? titleMatch[1].trim() : 'Dashboard Icon';
  
  if (titleMatch) {
    const titleTagMatch = svgContent.match(/<title([^>]*)>/i);
    const existingId = titleTagMatch && titleTagMatch[1] ? titleTagMatch[1].match(/id\s*=\s*["']([^"']+)["']/) : null;
    
    if (existingId) {
      return svgContent.replace(/<svg([^>]*)>/i, `<svg$1 aria-labelledby="${existingId[1]}">`);
    } else {
      const titledSvgContent = svgContent.replace(
        /<title([^>]*)>/i,
        `<title$1 id="svg-title-${Math.random().toString(36).substr(2, 9)}">`
      );
      return titledSvgContent;
    }
  }
  
  return svgContent.replace(/<svg([^>]*)>/i, `<svg$1 aria-label="${titleText}">`);
}

module.exports = {
  VERSION,
  init,
  processData,
  validate,
  transform,
  ensureSvgAccessibleNames
};