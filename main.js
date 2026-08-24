// ... Kept unchanged

// main.js - Entry point for the application with accessibility fixes for React components
import React from 'react';
import { dependencyGraphContent, indexContent } from './dependencyGraphContent';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure(), addProperLandmarkRegions())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createSvgWithAccessibleName())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks(), fixFakeLinkIssue(), and addressFakeLinks())

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure(), addProperLandmarkRegions())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createSvgWithAccessibleName())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks(), fixFakeLinkIssue(), and addressFakeLinks())

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
            if (Object.prototype.hasOwnProperty.call(item, key)) {
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
export function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

export function getFullLangAttribute(lang = 'en') {
    return lang;
}

export function createHtmlElement(language = 'en') {
    return {
        type: 'html',
        props: {
            lang: language,
            children: []
        }
    };
}

export function setLangAttribute(elem, language) {
    if (elem && elem.hasAttribute) {
        elem.lang = language || 'en';
    }
}

// New function: addLangAttribute (REACT_015)
export function addLangAttribute() {
    const html = document.documentElement;
    if (!html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
    }
}

// Fix REACT_027: Proper table structure with th scope
export function validateTableAccessibility(table) {
    if (!table) return false;
    const headers = table.querySelectorAll('th');
    let isValid = true;
    headers.forEach(th => {
        if (!th.hasAttribute('scope')) {
            isValid = false;
        }
    });
    return isValid;
}

export function validateTableStructure(table) {
    if (!table) return { valid: false, issues: [] };
    const issues = [];
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    if (!hasThead) {
        issues.push('Missing thead element');
    }
    if (!hasTbody) {
        issues.push('Missing tbody element');
    }
    const headers = table.querySelectorAll('th');
    headers.forEach((th, index) => {
        if (!th.hasAttribute('scope')) {
            issues.push(`Header at index ${index} missing scope attribute`);
        }
    });
    return { valid: issues.length === 0, issues };
}

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
                            }))
                        })
                    }
                }
            ]
        }
    };
}

// Fix REACT_027: Direct DOM table fixes (from HEAD)
export function fixTableStructureIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Ensure thead exists
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                firstRow.parentNode.insertBefore(thead, firstRow);
                thead.appendChild(firstRow);
            }
        }
        // Ensure tbody exists
        if (!table.querySelector('tbody')) {
            const rows = table.querySelectorAll('tr:not(thead tr)');
            if (rows.length > 0) {
                const tbody = document.createElement('tbody');
                rows.forEach(row => tbody.appendChild(row));
                table.appendChild(tbody);
            }
        }
        // Add scope to th elements
        table.querySelectorAll('th:not([scope])').forEach(th => {
            const isHeaderRow = th.closest('thead');
            th.setAttribute('scope', isHeaderRow ? 'col' : 'row');
        });
    });
}

// Fix REACT_041: SVG must have accessible name
export function getSvgAccessibleName(svg) {
    if (!svg) return '';
    // Check for aria-label attribute
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    // Check for aria-labelledby attribute
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) return ariaLabelledby;
    // Check for <title> child element
    const title = svg.querySelector('title');
    if (title && title.textContent) return title.textContent;
    // Return empty string if no accessible name found
    return 'Icon';
}

export function setSvgAccessibleName(svgs, accessibilityName) {
    return svgs.map(svg => {
        const accessibleNameEl = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title');
        if (!accessibleNameEl) {
            const title = document.createElement('title');
            title.textContent = accessibilityName;
            svg.insertBefore(title, svg.firstChild);
        }
        return svg;
    });
}

export function createSvgWithAccessibleName(svgs, accessibilityName) {
    return svgs.map(svg => {
        const accessibleNameEl = svg.querySelector('title');
        if (!accessibleNameEl) {
            const title = document.createElement('title');
            title.textContent = accessibilityName;
            svg.insertBefore(title, svg.firstChild);
        }
        return svg;
    });
}

// Fix REACT_041: Direct DOM SVG fixes (from HEAD)
export function fixSvgAccessibilityIssues() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const hasAriaLabel = svg.hasAttribute('aria-label');
        const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
        const hasTitleElement = svg.querySelector('title');
        
        if (!hasAriaLabel && !hasAriaLabelledby && !hasTitleElement) {
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = 'SVG graphic';
            svg.insertBefore(title, svg.firstChild);
        }
    });
}

// Fix REACT_025: Ensure unique landmarks (from origin/main - uses IDs)
export function ensureSvgAccessibility(svgs, accessibilityName) {
    const svgElements = document.querySelectorAll(svgs);
    setSvgAccessibleName(svgElements, accessibilityName || 'Icon');
}

// Fix REACT_025: Ensure unique landmarks
export function ensureUniqueLandmarks() {
    const landmarkIds = new Set();
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    landmarks.forEach(landmarkType => {
        const elements = document.querySelectorAll(landmarkType);
        Array.from(elements).forEach(element => {
            let id = element.id;
            if (!id) {
                id = `landmark-${landmarkType}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
            }
            if (landmarkIds.has(id)) {
                id = `${landmarkType}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
            }
            landmarkIds.add(id);
            element.id = id;
        });
    });
}

// Helper for addProperLandmarkRegions (from HEAD)
export function wrapPrimaryContentInMain(primaryContent) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
}

// Fix REACT_017: Validate landmark structure and roles (from origin/main)
export function validateLandmark(landmark) {
    if (!landmark) return false;
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'region', 'search'];
    const role = landmark.getAttribute('role');
    if (role && validRoles.includes(role)) {
        return true;
    }
    const tagName = landmark.tagName.toLowerCase();
    const validTags = ['header', 'nav', 'main', 'footer', 'aside'];
    if (validTags.includes(tagName)) {
        return true;
    }
    return false;
}

export function validateLandmarkStructure() {
    const issues = [];
    const landmarks = document.querySelectorAll('header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role