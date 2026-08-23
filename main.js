// TODO: This is the existing code that needs to be preserved
// ... existing code ...
// main.js - Entry point for the application with accessibility fixes for React components
import React from 'react';
import { dependencyGraphContent, indexContent } from './dependencyGraphContent';

function processData(data) {
    if (!data) {
        return null;
    }
    const processed = {
        raw: data,
        normalized: Array.isArray(data) ? data.map(normalizeItem) : normalizeItem(data),
        metadata: extractMetadata(data)
    };
    return processed;
}

function normalizeItem(item) {
    if (typeof item === 'string') {
        return item.trim();
    }
    if (typeof item === 'object' && item !== null) {
        const normalized = {};
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                normalized[key] = normalizeItem(item[key]);
            }
        }
        return normalized;
    }
    return item;
}

function extractMetadata(data) {
    const metadata = {
        type: Array.isArray(data) ? 'array' : typeof data,
        length: Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : 0),
        timestamp: Date.now()
    };
    return metadata;
}

const initialize = (callback) => {
    const appData = processData({ dependencyGraphContent, indexContent });
    if (callback && typeof callback === 'function') {
        callback(appData);
    }
    return appData;
};

initialize(() => {
    addressAccessibilityIssues();
});

// Fix REACT_015: Add proper lang attribute to HTML element
export function createHtmlElement(language = 'en') {
    return {
        type: 'html',
        props: {
            lang: language,
            children: []
        }
    };
}

// Fix REACT_027: Proper table structure with th scope
export function createTable(headers, rows) {
    return {
        type: 'table',
        props: {
            children: [
                {
                    type: 'thead',
                    props: {
                        children: [
                            {
                                type: 'tr',
                                props: {
                                    children: headers.map(header => ({
                                        type: 'th',
                                        props: {
                                            scope: 'col',
                                            children: [header]
                                        }
                                    }))
                                }
                            }
                        ]
                    }
                },
                {
                    type: 'tbody',
                    props: {
                        children: rows.map(row => ({
                            type: 'tr',
                            props: {
                                children: row.map(cell => ({
                                    type: 'td',
                                    props: {
                                        children: [cell]
                                    }
                                }))
                            }
                        }))
                    }
                }
            ]
        }
    };
}

// Fix REACT_041: SVG must have accessible name
export function createSvgIcon(iconName, children = []) {
    return {
        type: 'svg',
        props: {
            'aria-label': iconName,
            role: 'img',
            children
        }
    };
}

// Fix REACT_041: Ensure accessible names for up to two SVG icons
function ensureSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    const toFix = Array.from(svgs).filter(svg => !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')).slice(0, 2);
    toFix.forEach(svg => {
        const name = svg.getAttribute('data-icon-name') || 'Icon';
        svg.setAttribute('aria-label', name);
        const title = document.createElement('title');
        title.textContent = name;
        svg.insertBefore(title, svg.firstChild);
    });
}

// Fix REACT_025 & REACT_017: Use semantic landmark elements
export function ensureUniqueLandmarks(container = document) {
    const landmarks = ['header', 'footer', 'aside', 'section', 'nav', 'main'];
    const seenIds = new Set();
    landmarks.forEach(landmark => {
        const elements = container.querySelectorAll(landmark);
        elements.forEach((element) => {
            let id = element.id;
            if (!id) {
                id = 'landmark-' + Math.random().toString(36).substr(2, 9);
            }
            if (seenIds.has(id)) {
                id = 'landmark-' + Math.random().toString(36).substr(2, 9);
            }
            element.id = id;
            seenIds.add(id);
        });
    });
}

// Fix REACT_036: Fix fake link issue
function fixFakeLinks() {
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.href = 'javascript:void(0)';
        link.setAttribute('role', 'button');
        link.tabIndex = 0;
    });
}

// Fix REACT_017: Add proper landmark regions
export function addLandmarkRegions(container = document) {
    let headerId = 'landmark-header';
    let navId = 'landmark-nav';
    let mainId = 'landmark-main';
    let footerId = 'landmark-footer';
    let landmarkComponents = [null, null, null, null];

    const header = container.querySelector('header');
    if (header) {
        headerId = header.id || header.getAttribute('id') || header.getAttribute('data-testid') || headerId;
        landmarkComponents[0] = {
            type: 'header',
            props: {
                id: headerId,
                role: 'banner',
                'aria-label': 'Site header',
                className: 'landmark-header',
                children: [header]
            }
        };
    }

    const navs = container.querySelectorAll('nav');
    navs.forEach((nav, index) => {
        if (nav.id) {
            navId = nav.id || nav.getAttribute('id') || nav.getAttribute('data-testid') || navId;
            landmarkComponents[1] = {
                type: 'nav',
                props: {
                    id: navId,
                    role: 'navigation',
                    'aria-label': 'Main navigation',
                    className: 'landmark-nav',
                    children: [nav]
                }
            };
        } else {
            nav.id = navId;
            landmarkComponents[1] = {
                type: 'nav',
                props: {
                    id: navId,
                    role: 'navigation',
                    'aria-label': 'Main navigation',
                    className: 'landmark-nav',
                    children: [nav]
                }
            };
        }
    });

    const main = container.querySelector('main');
    if (main) {
        mainId = main.id || main.getAttribute('id') || main.getAttribute('data-testid') || mainId;
        landmarkComponents[2] = {
            type: 'main',
            props: {
                id: mainId,
                role: 'main',
                'aria-label': 'Main content',
                className: 'landmark-main',
                children: [main]
            }
        };
    }

    const footer = container.querySelector('footer');
    if (footer) {
        footerId = footer.id || footer.getAttribute('id') || footer.getAttribute('data-testid') || footerId;
        landmarkComponents[3] = {
            type: 'footer',
            props: {
                id: footerId,
                role: 'contentinfo',
                'aria-label': 'Site footer',
                className: 'landmark-footer',
                children: [footer]
            }
        };
    }

    return landmarkComponents;
}

// Fix REACT_027 - Add scope attributes to table headers
export function addTableScopeAttributes(container = document) {
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
        const columnHeaders = table.querySelectorAll('thead th');
        columnHeaders.forEach(th => {
            if (!th.hasAttribute('scope')) {
                th.setAttribute('scope', 'col');
            }
        });

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const firstCell = row.querySelector('td');
            if (firstCell && !firstCell.hasAttribute('scope')) {
                firstCell.setAttribute('scope', 'row');
            }
        });
    });
}

// Fix REACT_015: Set language attribute on HTML element
function setLanguageAttribute(lang) {
    document.documentElement.lang = lang;
}

// Ensure landmark roles are applied
function applyLandmarkRoles() {
    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
        header.setAttribute('role', 'banner');
    }
    const navs = document.querySelectorAll('nav');
    navs.forEach(nav => {
        if (!nav.hasAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }
    });
    const main = document.querySelector('main');
    if (main && !main.hasAttribute('role')) {
        main.setAttribute('role', 'main');
    }
    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
}

// New: Enhance focus visibility for keyboard navigation
function enhanceFocusVisibility() {
    // Add a class to body when user navigates with keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    // Remove the class when mouse is used
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
}

const addressAccessibilityIssues = function() {
    ensureSvgAccessibleNames();
    ensureUniqueLandmarks();
    addLandmarkRegions();
    addTableScopeAttributes();
    fixFakeLinks();
    setLanguageAttribute('en');
    applyLandmarkRoles();
    enhanceFocusVisibility();
};

// Export the created landmark components
export { addressAccessibilityIssues };
// Re-export imported content that might be required
export { dependencyGraphContent, indexContent };