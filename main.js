// Updated: imported and used dependencyGraphContent and indexContent in the
// relevant rendering functions.

import { class1, function1, Object1 } from './path/to/module';
import { dependencyGraphContent } from './content/dependencyGraphContent';
import { indexContent } from './content/indexContent';

// Export imported values (if needed)
export { class1, function1, Object1 };

// Function to count dependencies
export function countDependencies() {
  // Get all import statements from the module
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"][^'"]+['"]|['"][^'"]+['"])/g;
  const moduleCode = __filename;
  
  // Read the current file and count named imports
  const fs = require('fs');
  const content = fs.readFileSync(moduleCode, 'utf-8');
  
  // Match import statements with named imports ( {...} )
  const importMatches = content.match(importRegex) || [];
  
  let count = 0;
  importMatches.forEach(match => {
    // Extract the content inside the braces
    const braceMatch = match.match(/\{([^}]+)\}/);
    if (braceMatch) {
      const imports = braceMatch[1];
      // Split by comma and filter out whitespace, count remaining imports
      const importList = imports.split(',').map(s => s.trim()).filter(s => s && !s.startsWith('type '));
      count += importList.length;
    }
  });
  
  return count;
}

// Function to create an in-page navigation button
export function createInPageButton(options = {}) {
  const {
    text = 'Navigate',
    targetId,
    className = 'in-page-button',
    ariaLabel,
    iconText = '',
    onClick
  } = options;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  
  // Add accessible text content
  const accessibleText = document.createElement('span');
  accessibleText.textContent = text;
  accessibleText.className = 'sr-only';
  
  // For screen readers, add aria-label if provided
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  } else {
    button.setAttribute('aria-label', `Navigate to ${text}`);
  }
  
  // Add visible content with icon
  const visibleContent = document.createElement('span');
  visibleContent.className = 'button-content';
  if (iconText) {
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconText;
    visibleContent.appendChild(icon);
  }
  
  button.appendChild(accessibleText);
  button.appendChild(visibleContent);
  
  // Set up click handler for smooth scrolling
  if (targetId) {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.tabIndex = -1;
        targetElement.focus({ preventScroll: true });
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Announce navigation to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Navigated to ${text || targetId}`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
      }
      if (typeof onClick === 'function') {
        onClick(event);
      }
    });
    
    // Link the button to the target for accessibility
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const targetLabel = targetElement.getAttribute('aria-label') || 
                          targetElement.getAttribute('title') ||
                          targetId;
      button.setAttribute('aria-label', `${text} to ${targetLabel}`);
      button.setAttribute('aria-controls', targetId);
    }
  } else if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Ensure proper button semantics
  button.setAttribute('role', 'button');
  
  return button;
}

// Function to create an accessible link
export function createAccessibleLink(options = {}) {
  const {
    href = '#',
    text = '',
    title,
    className = 'accessible-link',
    target,
    rel,
    ariaLabel,
    ariaDescribedby,
    external = false,
    download = false,
    onClick
  } = options;

  const link = document.createElement('a');
  
  // Set href
  if (href) {
    link.href = href;
  } else {
    link.href = '#';
    link.setAttribute('aria-disabled', 'true');
  }
  
  // Add basic attributes
  link.className = className;
  
  if (text) {
    link.textContent = text;
  }
  
  // Add title attribute for mouse users
  if (title) {
    link.title = title;
  }
  
  // Handle target attribute
  if (target) {
    link.target = target;
    if (external || target === '_blank') {
      link.rel = rel || 'noopener noreferrer';
      
      // Announce to screen readers that link opens in new tab
      if (!ariaLabel) {
        ariaLabel = `${text || title || 'Link'} (opens in new tab)`;
      }
    }
  }
  
  // Handle download attribute
  if (download) {
    link.download = typeof download === 'string' ? download : '';
  }
  
  // Set ARIA attributes for accessibility
  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }
  
  if (ariaDescribedby) {
    link.setAttribute('aria-describedby', ariaDescribedby);
  }
  
  // Add icon indicator for external links
  if (external || target === '_blank') {
    link.setAttribute('aria-label', ariaLabel || `${text || title || 'Link'} (opens in new tab)`);
    
    // Add visually hidden text to indicate new tab
    const newTabIndicator = document.createElement('span');
    newTabIndicator.className = 'sr-only';
    newTabIndicator.textContent = '(opens in new tab)';
    link.appendChild(newTabIndicator);
  }
  
  // Handle click events
  if (typeof onClick === 'function') {
    link.addEventListener('click', (event) => {
      // Check if link is disabled
      if (link.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        return;
      }
      onClick(event);
    });
  }
  
  // Handle keyboard interaction
  link.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Allow default behavior but ensure focus is visible
      setTimeout(() => {
        link.classList.add('focus-visible');
      }, 0);
    }
  });
  
  // Add focus indicator for accessibility
  link.addEventListener('focus', () => {
    link.classList.add('keyboard-focus');
  });
  
  link.addEventListener('blur', () => {
    link.classList.remove('keyboard-focus');
  });
  
  return link;
}

// Function to render dependency graphs
export function renderDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }
  
  // Use dependencyGraphContent to render the graph
  const graphHtml = dependencyGraphContent();
  container.innerHTML = graphHtml;
  
  // Apply accessibility improvements to the rendered graph
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `Dependency graph ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
  
  return container;
}

// Function to render index view
export function renderIndexView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return null;
  }
  
  // Use indexContent to render the index view
  const indexHtml = indexContent();
  container.innerHTML = indexHtml;
  
  // Ensure proper landmark structure for accessibility
  const existingMain = container.querySelector('main, [role="main"]');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    mainElement.setAttribute('role', 'main');
    
    // Move all children into main
    while (container.firstChild) {
      const child = container.firstChild;
      if (child.tagName !== 'SCRIPT' && 
          child.tagName !== 'STYLE' &&
          child.tagName !== 'LINK') {
        mainElement.appendChild(child);
      } else {
        container.appendChild(child);
      }
    }
    
    container.appendChild(mainElement);
  }
  
  return container;
}

// Function to add lang attribute to HTML element
export function setLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to get lang attribute from HTML element
export function getLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    return htmlElement.getAttribute('lang');
  }
  return null;
}

// Function to get full lang attribute (including xml:lang and complete language info)
export function getFullLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    const lang = htmlElement.getAttribute('lang');
    if (lang) {
      const xmlLang = htmlElement.getAttribute('xml:lang');
      return xmlLang || lang;
    }
  }
  return null;
}

// Function to fix table structure issues
export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = Array.from(table.querySelectorAll('tr'));

    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      // Move first row to thead and convert cells to th
      while (firstRow.firstChild) {
        const cell = firstRow.firstChild;
        const th = document.createElement('th');
        th.textContent = cell.textContent;
        th.scope = 'col';
        headerRow.appendChild(th);
        cell.remove();
      }
      thead.appendChild(headerRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }

    if (!existingTbody) {
      const remainingRows = rows.length > 1 ? rows.slice(1) : [];
      if (remainingRows.length > 0) {
        const