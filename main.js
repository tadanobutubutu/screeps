// Main entry point for dependency visualization tool

const fs = require('fs');
const path = require('path');

/**
 * Calculates the depth of dependency tree
 * @param {Object} dependencies - The dependency object
 * @param {string} currentKey - Current key being processed
 * @returns {number} Maximum depth of the dependency tree
 */
function getDependencyDepth(dependencies, currentKey = '') {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }
  
  let maxDepth = 0;
  const keys = Object.keys(dependencies);
  
  keys.forEach(key => {
    const value = dependencies[key];
    if (typeof value === 'object' && value !== null) {
      const nestedDepth = getDependencyDepth(value, key);
      maxDepth = Math.max(maxDepth, nestedDepth + 1);
    }
  });
  
  return maxDepth;
}

/**
 * Renders a dependency graph as ASCII art for debugging purposes.
 * @param {Object} dependencies - The dependency object
 * @param {string} prefix - Current prefix for indentation
 * @param {boolean} isLast - Whether this is the last item at current level
 * @returns {string} ASCII representation of the dependency graph
 */
function renderDependencyGraph(dependencies, prefix = '', isLast = true) {
  if (!dependencies || typeof dependencies !== 'object') {
    return '';
  }
  
  let output = '';
  const keys = Object.keys(dependencies);
  
  keys.forEach((key, index) => {
    const isLastItem = index === keys.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const value = dependencies[key];
    
    output += `${prefix}${connector}${key}`;
    
    if (typeof value === 'object' && value !== null) {
      output += '/\n';
      const extension = isLast ? '    ' : '│   ';
      output += renderDependencyGraph(value, prefix + extension, isLastItem);
    } else {
      output += ` -> ${value}\n`;
    }
  });
  
  return output;
}

/**
 * Displays module structure for debugging purposes.
 * @param {Array} modules - Array of module objects
 * @returns {string} Formatted module structure display
 */
function displayModuleStructure(modules) {
  if (!Array.isArray(modules)) {
    return 'Error: modules must be an array';
  }
  
  let output = 'Module Structure:\n';
  output += '==================\n\n';
  
  modules.forEach((mod, index) => {
    const name = mod.name || mod.id || `Module ${index + 1}`;
    output += `${index + 1}. ${name}\n`;
    
    if (mod.dependencies && Array.isArray(mod.dependencies)) {
      output += `   Dependencies: ${mod.dependencies.join(', ')}\n`;
    }
    
    if (mod.path) {
      output += `   Path: ${mod.path}\n`;
    }
    
    output += '\n';
  });
  
  return output;
}

/**
 * Generates a dependency report for debugging
 * @param {Object} dependencies - The dependency object
 * @returns {Object} Report containing statistics
 */
function generateDependencyReport(dependencies) {
  return {
    totalDependencies: Object.keys(dependencies).length,
    maxDepth: getDependencyDepth(dependencies),
    graph: renderDependencyGraph(dependencies)
  };
}

/**
 * Main processing function
 */
function main() {
  const sampleDependencies = {
    'express': '4.18.2',
    'lodash': {
      'isArray': '4.0.0',
      'merge': {
        'isObject': '4.0.0'
      }
    }
  };
  
  console.log('Dependency Graph:');
  console.log(renderDependencyGraph(sampleDependencies));
  
  console.log('Depth:', getDependencyDepth(sampleDependencies));
}

// New function to visualize the dependency tree
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(htmlString, lang = 'en') {
  if (typeof htmlString !== 'string') {
    return htmlString;
  }
  
  // Check if lang attribute already exists
  if (/<html\s+[^>]*\blang\s*=/i.test(htmlString)) {
    return htmlString;
  }
  
  // Add lang attribute to the html element
  return htmlString.replace(
    /<html(\s*)>/i,
    `<html$1 lang="${lang}">`
  );
}

// REACT_027: Fix table structure issues
function fixTableStructure(htmlString) {
  if (typeof htmlString !== 'string') {
    return htmlString;
  }
  
  let result = htmlString;
  
  // Ensure <table> has proper structure - add <tbody> if missing and <tr> elements are direct children
  result = result.replace(
    /<table([^>]*)>(\s*)(<tr[\s\S]*?<\/tr>)(\s*)<\/table>/gi,
    (match, attrs, whitespace, trContent, closingWs) => {
      // Only add tbody if it's not already present
      if (/<tbody[\s>]/i.test(trContent)) {
        return match;
      }
      return `<table${attrs}>${whitespace}<tbody>${trContent}</tbody>${closingWs}</table>`;
    }
  );
  
  return result;
}

// REACT_017: Add/fix landmark issues
function addMainLandmark(htmlString) {
  if (typeof htmlString !== 'string') {
    return htmlString;
  }
  
  // Check if a <main> element already exists
  if (/<main[\s>]/i.test(htmlString)) {
    return htmlString;
  }
  
  // Wrap content within <main> landmark - place after <body> opening tag
  return htmlString.replace(
    /(<body[^>]*>)([\s\S]*)(<\/body>)/i,
    (match, openTag, content, closeTag) => {
      // If content is just whitespace, don't add main
      if (!content.trim()) {
        return match;
      }
      return `${openTag}\n<main>\n${content}\n</main>\n${closeTag}`;
    }
  );
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(htmlString) {
  if (typeof htmlString !== 'string') {
    return htmlString;
  }
  
  const landmarkTags = ['main', 'nav', 'header', 'footer', 'aside'];
  let result = htmlString;
  
  landmarkTags.forEach(tag => {
    const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'gi');
    const matches = [];
    let match;
    
    while ((match = regex.exec(result)) !== null) {
      matches.push({ full: match[0], index: match.index });
    }
    
    // If multiple landmarks of the same type exist, mark them
    if (matches.length > 1) {
      matches.slice(1).forEach((m, i) => {
        const ariaLabel = `Region ${i + 2}`;
        const replacement = m.full.replace(
          new RegExp(`<${tag}`, 'i'),
          `<${tag} aria-label="${ariaLabel}"`
        );
        result = result.replace(m.full, replacement);
      });
    }
  });
  
  return result;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(htmlString) {
  if (typeof htmlString !== 'string') {
    return htmlString;
  }
  
  // Find SVGs without aria-label or aria-labelledby or title
  return htmlString.replace(
    /<svg([^>]*?)(\s*)(\/?)>/gi,
    (match, attrs, whitespace, selfClose) => {
      // Check if it already has aria-label, aria-labelledby, role="img", or title
      const hasAriaLabel = /\baria-label\s*=/i.test(attrs);
      const hasAriaLabelledby = /\baria-labelledby\s*=/i.test(i);
      const hasRole = /\brole\s*=\s*["']img["']/i.test(attrs);
      
      if (hasAriaLabel || hasAriaLabelledby || hasRole) {
        return match;
      }
      
      // Add aria-label and role="img" for accessibility
      return `<svg${attrs} role="img" aria-label="Decorative icon"${whitespace}${selfClose}>`;
    }
  );
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue(htmlString) {
  if (typeof htmlString !== 'string') {
    return htmlString;
  }
  
  // Convert elements with onclick handlers that look like links to actual links
  // Pattern: <div onclick="..." class="...link..."> or <span onclick="..." class="...link...">
  let result = htmlString.replace(
    /<(div|span)([^>]*\bonclick\s*=\s*["'][^"']*["'][^>]*)>/gi,
    (match, tag, attrs) => {
      // Check if it appears to be acting as a link
      const hasLinkClass = /\bclass\s*=\s*["'][^"']*\blink\b[^"']*["']/i.test(attrs) ||
                           /\bclass\s*=\s*["'][^"']*link[^"']*["']/i.test(attrs);
      
      if (!hasLinkClass) {
        return match;
      }
      
      // Extract href from onclick if it contains location or href
      const onclickMatch = attrs.match(/\bonclick\s*=\s*["']([^"']*)["']/i);
      let href = '#';
      
      if (onclickMatch) {
        const onclickCode = onclickMatch[1];
        const hrefMatch = onclickCode.match(/(?:location\.href\s*=|window\.location\s*=|href\s*=)\s*['"]([^'"]+)['"]/i);
        if (hrefMatch) {
          href = hrefMatch[1];
        }
      }
      
      // Replace the onclick attribute with href and role
      const newAttrs = attrs.replace(
        /\bonclick\s*=\s*["'][^"']*["']/i,
        ` href="${href}" role="link"`
      );
      
      return `<a${newAttrs}>`;
    }
  );
  
  // Close the corresponding tags - this is a simplified approach
  result = result.replace(
    /<a([^>]*\bonclick-was-here[^>]*)>([\s\S]*?)<\/(div|span)>/gi,
    '<a$1>$2</a>'
  );
  
  return result;
}

module.exports = {
  renderDependencyGraph,
  displayModuleStructure,
  getDependencyDepth,
  generateDependencyReport,
  main,
  visualizeDependencyTree,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};

// Run if executed directly
if (require.main === module) {
  main();
}