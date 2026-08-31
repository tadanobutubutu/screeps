// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;
  
  const summary = {
    totalIssues: issues.length,
    linkIssuesFixed: 0,
    buttonIssuesFixed: 0,
    skipped: 0,
    fixes: []
  };

  issues.forEach((issue) => {
    if (!issue.element || !issue.element.parentNode) {
      summary.skipped++;
      return;
    }

    try {
      if (issue.type === 'link') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.linkIssuesFixed++;
        summary.fixes.push({
          type: 'link',
          index: issue.index,
          action: 'Added accessible text content'
        });
      } else if (issue.type === 'button') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.buttonIssuesFixed++;
        summary.fixes.push({
          type: 'button',
          index: issue.index,
          action: 'Added accessible name'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Failed to fix',
        error: error.message
      });
    }
  });

  return summary;
}

/**
 * Renders a graph visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} data - The graph data to render
 * @returns {Object} - The rendered graph instance
 */
function renderGraph(container, data) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');
  
  // Render nodes
  if (data.nodes) {
    data.nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x || 0);
      circle.setAttribute('cy', node.y || 0);
      circle.setAttribute('r', node.radius || 10);
      circle.setAttribute('fill', node.color || '#007bff');
      svg.appendChild(circle);
    });
  }
  
  // Render edges
  if (data.edges) {
    data.edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', edge.sourceX || 0);
      line.setAttribute('y1', edge.sourceY || 0);
      line.setAttribute('x2', edge.targetX || 0);
      line.setAttribute('y2', edge.targetY || 0);
      line.setAttribute('stroke', '#333');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });
  }
  
  container.appendChild(svg);
  
  return {
    element: svg,
    destroy: function() {
      if (container.contains(svg)) {
        container.removeChild(svg);
      }
    }
  };
}

/**
 * Renders an index visualization
 * @param {HTMLElement} container - The container element for the index
 * @param {Array} items - Array of items to display in the index
 * @returns {Object} - The rendered index instance
 */
function renderIndex(container, items) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const list = document.createElement('ul');
  list.style.listStyleType = 'none';
  list.style.padding = '0';
  list.style.margin = '0';
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.label || item.name || String(item);
    li.style.padding = '8px';
    li.style.borderBottom = '1px solid #eee';
    list.appendChild(li);
  });
  
  container.appendChild(list);
  
  return {
    element: list,
    destroy: function() {
      if (container.contains(list)) {
        container.removeChild(list);
      }
    }
  };
}

// TODO: Update the existing function using the new functions for rendering graph/index
// This function can now use renderGraph and renderIndex for visualization needs
function renderDataVisualization(container, data, options = {}) {
  const useGraph = options.useGraph !== undefined ? options.useGraph : true;
  
  if (useGraph && data.nodes && data.edges) {
    return renderGraph(container, data);
  } else if (data.items) {
    return renderIndex(container, data.items);
  }
  
  throw new Error('Unsupported data format for visualization');
}

function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addressAccessibilityIssues, calculateSum, calculateProduct, renderGraph, renderIndex, renderDataVisualization };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.renderGraph = renderGraph;
  window.renderIndex = renderIndex;
  window.renderDataVisualization = renderDataVisualization;
}