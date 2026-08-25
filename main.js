// main.js

/**
 * Format the given date to a localized string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generate a unique ID for elements
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique identifier
 */
function generateUniqueId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => escapeMap[char]);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Create a DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string} children - Child elements or text
 * @returns {HTMLElement} Created DOM element
 */
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    if (typeof children === 'string') {
        element.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

// TODO: Implement wrapPrimaryContentInMain function

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Parse URL query parameters
 * @param {string} queryString - Query string to parse
 * @returns {Object} Parsed parameters
 */
function parseQueryParams(queryString) {
    const params = {};
    const searchParams = new URLSearchParams(queryString);
    for (const [key, value] of searchParams) {
        params[key] = value;
    }
    return params;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Whether element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export utility functions
export {
    formatDate,
    generateUniqueId,
    escapeHtml,
    isValidEmail,
    debounce,
    createElement,
    wrapPrimaryContentInMain,
    throttle,
    parseQueryParams,
    isInViewport
};

// Also expose for non-module usage
if (typeof window !== 'undefined') {
    window.MainUtils = {
        formatDate,
        generateUniqueId,
        escapeHtml,
        isValidEmail,
        debounce,
        createElement,
        wrapPrimaryContentInMain,
        throttle,
        parseQueryParams,
        isInViewport
    };
}

/**
 * Wrap primary content in a <main> element
 * 
 * This function identifies the primary content area of a page and wraps it
 * in a semantic <main> element for better accessibility and SEO.
 * 
 * @param {string|HTMLElement|Array} content - Content to wrap (selector string, DOM element, or array of elements)
 * @param {Object} options - Configuration options
 * @param {string} [options.id='main-content'] - ID for the main element
 * @param {string} [options.className=''] - Additional classes for the main element
 * @param {boolean} [options.removeOldMain=true] - Whether to remove existing main elements
 * @param {HTMLElement} [options.container=document.body] - Container to append to
 * @returns {HTMLElement} The created <main> element
 */
function wrapPrimaryContentInMain(content, options = {}) {
    const {
        id = 'main-content',
        className = '',
        removeOldMain = true,
        container = document.body
    } = options;

    // Remove existing main elements if requested
    if (removeOldMain) {
        const existingMains = container.querySelectorAll('main');
        existingMains.forEach(main => main.remove());
    }

    // Create the main element
    const mainElement = document.createElement('main');
    mainElement.id = id;
    if (className) {
        mainElement.className = className;
    }

    // Handle different content input types
    if (typeof content === 'string') {
        // Assume it's a selector
        const selectedElements = container.querySelectorAll(content);
        if (selectedElements.length === 0) {
            console.warn(`wrapPrimaryContentInMain: No elements found for selector "${content}"`);
            return null;
        }
        selectedElements.forEach(el => mainElement.appendChild(el.cloneNode(true)));
        // Remove original elements after cloning
        selectedElements.forEach(el => el.remove());
    } else if (content instanceof HTMLElement) {
        // Single element
        mainElement.appendChild(content.cloneNode(true));
        content.remove();
    } else if (Array.isArray(content)) {
        // Array of elements
        content.forEach(el => {
            if (el instanceof HTMLElement) {
                mainElement.appendChild(el.cloneNode(true));
                el.remove();
            }
        });
    } else if (content instanceof NodeList) {
        // NodeList
        content.forEach(el => {
            mainElement.appendChild(el.cloneNode(true));
            el.remove();
        });
    }

    // Append the main element to the container
    container.appendChild(mainElement);

    return mainElement;
}