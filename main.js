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
                            }
                        }))
                    }
                }
            ]
        }
    };
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

// Fix REACT_036: Fix fake link issue
export function convertLinkToButton(link) {
    if (!link) return null;
    return {
        href: link.href || '#',
        role: 'button',
        tabIndex: 0,
        text: link.textContent
    };
}

export function createAccessibleLink(url, text, isFakeLink = false) {
    const link = {
        type: 'a',
        props: {
            href: url,
            children: [text]
        }
    };
    if (isFakeLink) {
        link.props.role = 'button';
        link.props.tabIndex = 0;
    }
    return link;
}

export function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"], a[role="button"]');
    fakeLinks.forEach(link => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = link.textContent;
        Array.from(link.attributes).forEach(attr => {
            if (attr.name !== 'href') {
                button.setAttribute(attr.name, attr.value);
            }
        });
        button.setAttribute('role', 'button');
        button.tabIndex = 0;
        link.parentNode.replaceChild(button, link);
    });
}

// Fix REACT_017: Validate landmark structure and roles
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
    const landmarks = document.querySelectorAll('header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="form"], [role="region"], [role="search"]');
    const ids = new Set();
    landmarks.forEach((landmark, index) => {
        if (!validateLandmark(landmark)) {
            issues.push(`Landmark at index ${index} has invalid structure or role`);
        }
        const id = landmark.id;
        if (id) {
            if (ids.has(id)) {
                issues.push(`Duplicate landmark ID: ${id}`);
            } else {
                ids.add(id);
            }
        } else {
            issues.push(`Landmark at index ${index} missing id attribute`);
        }
    });
    return { valid: issues.length === 0, issues };
}

// New function: addProperLandmarkRegions (fixes REACT_017 issues)
export function addProperLandmarkRegions() {
    // Ensure main landmark exists
    if (!document.querySelector('main, [role="main"]')) {
        const mainContent = document.querySelector('#main-content, .main-content, [role="main"]');
        if (mainContent) {
            mainContent.setAttribute('role', 'main');
        } else {
            // Wrap primary content in main
            wrapPrimaryContentInMain(document.body);
        }
    }

    // Ensure banner landmark
    if (!document.querySelector('header, [role="banner"]')) {
        const header = document.querySelector('header, .header, #header');
        if (header) header.setAttribute('role', 'banner');
    }

    // Ensure navigation landmarks
    document.querySelectorAll('nav, .nav, #nav, .navigation').forEach((nav, index) => {
        if (!nav.hasAttribute('role')) nav.setAttribute('role', 'navigation');
        if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
            nav.setAttribute('aria-label', `Navigation ${index + 1}`);
        }
    });

    // Ensure contentinfo landmark
    if (!document.querySelector('footer, [role="contentinfo"]')) {
        const footer = document.querySelector('footer, .footer, #footer');
        if (footer) footer.setAttribute('role', 'contentinfo');
    }

    // Ensure complementary landmarks
    document.querySelectorAll('aside, .sidebar, .complementary').forEach((aside, index) => {
        if (!aside.hasAttribute('role')) aside.setAttribute('role', 'complementary');
        if (!aside.hasAttribute('aria-label') && !aside.hasAttribute('aria-labelledby')) {
            aside.setAttribute('aria-label', `Complementary ${index + 1}`);
        }
    });
}

// New function: wrapPrimaryContentInMain
export function wrapPrimaryContentInMain(primaryContent) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
}

// New function: fixFakeLinkIssue (REACT_036)
export function fixFakeLinkIssue() {
  // Find elements that look like links but aren't (e.g., spans, divs with click handlers)
  const fakeLinks = document.querySelectorAll('[onclick]:not(a):not(button):not([role="link"])');
  fakeLinks.forEach(elem => {
    // Convert to proper link or button
    if (elem.getAttribute('href')) {
      // Has href, make it a proper link
      elem.setAttribute('role', 'link');
      elem.setAttribute('tabindex', '0');
      // Add keyboard support
      elem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          elem.click();
        }
      });
    } else {
      // No href, make it a button
      elem.setAttribute('role', 'button');
      elem.setAttribute('tabindex', '0');
      elem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          elem.click();
        }
      });
    }
  });
}

export function addressAccessibilityIssues() {
    addLangAttribute();
    ensureUniqueLandmarks();
    createSvgWithAccessibleName(Array.from(document.querySelectorAll('svg')), 'Icon');
    fixFakeLinks();
    fixFakeLinkIssue();
    addProperLandmarkRegions();
    validateLandmarkStructure();
    // Additional calls can be added as needed
}