// Import content generators from separate modules
const { dependencyGraphContent, indexContent } = require('./contentGenerators');

// Existing rendering functions (preserving existing exports and functions)

function renderIndex(content = indexContent, options = {}) {
    // Render the index page with the provided content or default content
    const { title, metaDescription, sections } = content;
    
    // Generate the HTML for the index page
    let html = `<!DOCTYPE html>\n<html lang="${getLangAttribute()}">\n`;
    html += `<head>\n`;
    html += `  <meta charset="UTF-8">\n`;
    html += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
    if (metaDescription) {
        html += `  <meta name="description" content="${metaDescription}">\n`;
    }
    html += `  <title>${title || 'ScreetsBot'}</title>\n`;
    html += `</head>\n`;
    html += `<body>\n`;
    
    // Add sections
    if (sections && Array.isArray(sections)) {
        sections.forEach(section => {
            html += `  <section id="${section.id}" class="section">\n`;
            if (section.title) {
                html += `    <h2>${section.title}</h2>\n`;
            }
            if (section.content) {
                html += `    <div class="content">${section.content}</div>\n`;
            }
            html += `  </section>\n`;
        });
    }
    
    html += `</body>\n</html>`;
    
    return html;
}

function renderDependencyGraph(deps, options = {}) {
    // Render a dependency graph visualization
    const { 
        format = 'html', 
        includeMetadata = true,
        containerId = 'dependency-graph-container'
    } = options;
    
    // Generate the content using the content generator
    const content = dependencyGraphContent(deps);
    
    // Create the container element
    const container = document.createElement('div');
    container.id = containerId;
    container.className = 'dependency-graph';
    container.setAttribute('role', 'tree');
    container.setAttribute('aria-label', 'Dependency tree visualization');
    
    // Add accessibility attributes
    if (includeMetadata) {
        container.setAttribute('aria-describedby', 'dependency-graph-description');
    }
    
    // Build the tree structure
    let treeHTML = '';
    if (content.title) {
        treeHTML += `<h3>${content.title}</h3>\n`;
    }
    
    treeHTML += `<ul role='tree' aria-label='Dependency nodes'>\n`;
    
    if (content.nodes && Array.isArray(content.nodes)) {
        content.nodes.forEach(node => {
            const nodeId = `node-${node.id}`;
            treeHTML += `  <li role='treeitem' id='${nodeId}' aria-expanded='false'>\n`;
            treeHTML += `    <span aria-label='${node.name}, level ${node.level}'>${node.name}</span>\n`;
            if (node.children && node.children.length > 0) {
                treeHTML += `    <ul role='group'>\n`;
                node.children.forEach(child => {
                    treeHTML += `      <li role='treeitem'>${child.name}</li>\n`;
                });
                treeHTML += `    </ul>\n`;
            }
            treeHTML += `  </li>\n`;
        });
    }
    
    treeHTML += `</ul>\n`;
    
    container.innerHTML = treeHTML;
    
    // Add description if needed
    if (includeMetadata && content.description) {
        const desc = document.createElement('p');
        desc.id = 'dependency-graph-description';
        desc.className = 'sr-only';
        desc.textContent = content.description;
        container.appendChild(desc);
    }
    
    return container;
}

class ScreetsBot {
  constructor(options = {}) {
    this.options = options;
    this.initialized = false;
  }

  // ... (The rest of the class definition remains the same as in the original conflict branch)

  validateTableAccessibility(html) {
    if (!html) return { valid: false, errors: ['No HTML provided'] };
    
    const errors = [];
    
    // Check for table element
    if (!html.includes('<table')) {
      return { valid: false, errors: ['No table element found'] };
    }
    
    // Check for scope attribute on th elements
    const thMatches = html.match(/<th[^>]*>/g) || [];
    thMatches.forEach((th, index) => {
      if (!th.includes('scope=')) {
        errors.push(`Table header cell ${index + 1} missing scope attribute`);
      }
    });
    
    // Check for caption element (optional but recommended)
    if (!html.includes('<caption')) {
      errors.push('Table missing caption element for accessibility');
    }
    
    // Check for proper table structure (thead, tbody)
    if (!html.includes('<thead') && !html.includes('<th')) {
      errors.push('Table should have thead element with header cells');
    }
    
    // Check for summary or aria-label on table
    const tableMatch = html.match(/<table[^>]*>/);
    if (tableMatch) {
      const tableTag = tableMatch[0];
      if (!tableTag.includes('aria-label') && !tableTag.includes('summary')) {
        errors.push('Table should have aria-label or summary attribute for context');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  // ... (Add the event listener for click events on the dependencyGraph element)
  
  init() {
    if (this.initialized) return;
    
    // Initialize any required functionality
    window.addEventListener('click', this.handleClick.bind(this));
    this.initialized = true;
  }
  
  handleClick(e) {
    // Handle click events throughout the application
  }
}

// Add lang attribute to HTML element
function getLangAttribute() {
    // Implementation to add lang attribute
    return typeof document !== 'undefined' 
        ? (document.documentElement.lang || 'en')
        : 'en';
}

// Accessibility utilities for keyboard navigation and screen reader support
const accessibilityUtils = {
    /**
     * Initialize skip link functionality
     * @param {HTMLElement} skipLink - The skip link element
     */
    initSkipLink(skipLink) {
        if (!skipLink) return;
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(skipLink.getAttribute('href'));
            if (target) {
                target.tabIndex = -1;
                target.focus();
            }
        });
    },

    /**
     * Trap focus within an element for modal/dialog accessibility
     * @param {HTMLElement} element - Container element to trap focus within
     * @returns {Function} Cleanup function to remove event listeners
     */
    trapFocus(element) {
        if (!element) return () => {};

        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return () => {};

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        const handleKeyboard = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };

        element.addEventListener('keydown', handleKeyboard);
        
        // Return cleanup function
        return () => {
            element.removeEventListener('keydown', handleKeyboard);
        };
    },

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announceToScreenReader(message, priority = 'polite') {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        
        setTimeout(() => {
            if (document.body.contains(announcer)) {
                document.body.removeChild(announcer);
            }
        }, 1000);
    },

    /**
     * Handle keyboard navigation for custom components
     * @param {KeyboardEvent} e - Keyboard event
     * @param {Object} options - Navigation options
     */
    handleKeyboardNav(e, options = {}) {
        const { onEscape, onEnter, onArrowUp, onArrowDown } = options;
        
        switch (e.key) {
            case 'Escape':
                if (onEscape) onEscape(e);
                break;
            case 'Enter':
                if (onEnter) onEnter(e);
                break;
            case 'ArrowUp':
                if (onArrowUp) {
                    e.preventDefault();
                    onArrowUp(e);
                }
                break;
            case 'ArrowDown':
                if (onArrowDown) {
                    e.preventDefault();
                    onArrowDown(e);
                }
                break;
        }
    }
};

// New focus trap implementation with enhanced features
function newFocusTrap(element, options = {}) {
    const {
        initialFocus = true,
        returnFocusOnDeactivate = true,
        escapeDeactivates = true
    } = options;
    
    if (!element) {
        throw new Error('newFocusTrap: element is required');
    }

    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    // If no focusable elements, delegate to original trapFocus
    if (focusableElements.length === 0) {
        return accessibilityUtils.trapFocus(element);
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    let previouslyFocused = document.activeElement;

    const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
        }
    };

    const handleEscape = (e) => {
        if (e.key === 'Escape' && escapeDeactivates) {
            deactivate();
        }
    };

    const activate = () => {
        element.addEventListener('keydown', handleTabKey);
        element.addEventListener('keydown', handleEscape);
        
        if (initialFocus && first) {
            first.focus();
        }
    };

    const deactivate = () => {
        element.removeEventListener('keydown', handleTabKey);
        element.removeEventListener('keydown', handleEscape);
        
        if (returnFocusOnDeactivate && previouslyFocused && typeof previouslyFocused.focus === 'function') {
            previouslyFocused.focus();
        }
    };

    activate();

    return {
        activate,
        deactivate,
        updatePreviouslyFocused: (el) => {
            previouslyFocused = el;
        }
    };
}

// Create in-page navigation buttons
function createInPageButtons(container, navItems) {
    if (!container || !navItems || !Array.isArray(navItems)) return;
    
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'In-page navigation');
    
    const ul = document.createElement('ul');
    ul.className = 'in-page-nav';
    
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${item.id}`;
        a.textContent = item.text || item.id;
        a.setAttribute('aria-current', item.current ? 'page' : 'false');
        
        // Add click handler for accessibility
        a.addEventListener('click', (e) => {
            const target = document.querySelector(item.id);
            if (target) {
                target.tabIndex = -1;
                target.focus();
            }
        });
        
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    nav.appendChild(ul);
    container.appendChild(nav);
    
    return nav;
}

// Accessibility enhancements for dependency graph elements
function enhanceDependencyGraphAccessibility(graphElement) {
    if (!graphElement) return;
    
    graphElement.setAttribute('role', 'treegrid');
    graphElement.setAttribute('aria-multiselectable', 'false');
    
    // Add keyboard navigation support
    graphElement.addEventListener('keydown', (e) => {
        accessibilityUtils.handleKeyboardNav(e, {
            onArrowUp: () => {
                // Move to previous node in graph
            },
            onArrowDown: () => {
                // Move to next node in graph
            },
            onEnter: () => {
                // Expand/collapse node
            },
            onEscape: () => {
                // Close or deselect current node
            }
        });
    });
}

// Export all required functions and utilities
module.exports = {
    renderDependencyGraph,
    renderIndex,
    getLangAttribute,
    accessibilityUtils,
    trapFocus: accessibilityUtils.trapFocus,
    newFocusTrap,
    initSkipLink: accessibilityUtils.initSkipLink,
    announceToScreenReader: accessibilityUtils.announceToScreenReader,
    handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
    createInPageButtons,
    ScreetsBot,
    enhanceDependencyGraphAccessibility
};