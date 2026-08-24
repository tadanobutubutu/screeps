// ... Kept unchanged

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

// Fix REACT_015: Direct DOM manipulation for lang attribute (from HEAD)
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
    return svg.getAttribute('aria-label') ||
           svg.getAttribute('aria-labelledby') ||
           svg.querySelector('title')?.textContent ||
           'Icon';
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

// Fix REACT_025: Alternative implementation using aria-label (from HEAD)
export function ensureUniqueLandmarksAria() {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer');
    const seenRoles = new Set();
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        if (seenRoles.has(role)) {
            const count = document.querySelectorAll(`[role="${role}"]`).length;
            landmark.setAttribute('aria-label', `${role} ${count}`);
        } else {
            seenRoles.add(role);
        }
    });
}

// Fix REACT_036: Fix fake link issue (from origin/main)
export function createInPageButton(link) {
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

// Fix REACT_036: Alternative fake link fix (from HEAD)
export function fixFakeLinkIssue() {
    const fakeLinks = document.querySelectorAll('[onclick]:not(a):not(button):not([role="link"])');
    fakeLinks.forEach(elem => {
        if (elem.getAttribute('href')) {
            elem.setAttribute('role', 'link');
            elem.setAttribute('tabindex', '0');
            elem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    elem.click();
                }
            });
        } else {
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

// Fix REACT_017: Add proper landmark regions (from origin/main)
export function addLandmarkRegions() {
    const landmarksByType = {
        header: [],
        nav: [],
        main: [],
        footer: []
    };
    const selectors = [
        'header',
        'nav',
        'main',
        'footer',
        'aside, section:not([role="complementary"]):not([role="contentinfo"])'
    ];
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            const type = selector.toLowerCase();
            landmarksByType[type].push(element);
        });
    });
    landmarksByType['header'].forEach((header, index) => {
        const landmark = {
            type: 'header',
            props: {
                role: 'banner',
                id: header.id || `landmark-header-${index}`,
                children: [header]
            }
        };
        document.body.insertBefore(landmark.props.children[0], header);
    });
    landmarksByType['nav'].forEach((nav, index) => {
        const landmark = {
            type: 'nav',
            props: {
                role: 'navigation',
                id: nav.id || `landmark-nav-${index}`,
                children: [nav]
            }
        };
        document.body.insertBefore(landmark.props.children[0], nav);
    });
}

// Fix REACT_017: Add proper landmark regions - enhanced version (from HEAD)
export function addProperLandmarkRegions() {
    // Ensure main landmark exists
    if (!document.querySelector('main, [role="main"]')) {
        const mainContent = document.querySelector('#main-content, .main-content, [role="main"]');
        if (mainContent) {
            mainContent.setAttribute('role', 'main');
        } else {
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

// Helper for addProperLandmarkRegions (from HEAD)
export function wrapPrimaryContentInMain(primaryContent) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
}

// Fix REACT_017: Fix React landmark issue (from HEAD)
export function fixReactLandmarkIssue() {
    // Ensure main landmark
    if (!document.querySelector('main, [role="main"]')) {
        const mainContent = document.querySelector('#main-content, .main-content, [role="main"]');
        if (mainContent) {
            mainContent.setAttribute('role', 'main');
        }
    }
    
    // Fix duplicate landmarks
    ensureUniqueLandmarksAria();
    
    // Add missing landmark roles
    document.querySelectorAll('header:not([role])').forEach(h => h.setAttribute('role', 'banner'));
    document.querySelectorAll('nav:not([role])').forEach(n => n.setAttribute('role', 'navigation'));
    document.querySelectorAll('footer:not([role])').forEach(f => f.setAttribute('role', 'contentinfo'));
    document.querySelectorAll('aside:not([role])').forEach(a => a.setAttribute('role', 'complementary'));
}

// Address accessibility issues from insight report (from HEAD)
export function addressAccessibilityIssuesFromInsightReport() {
    // This function coordinates all accessibility fixes based on the insight report
    addLangAttribute();
    fixTableStructureIssues();
    fixSvgAccessibilityIssues();
    fixReactLandmarkIssue();
    ensureUniqueLandmarks();
    ensureUniqueLandmarksAria();
    fixFakeLinks();
    fixFakeLinkIssue();
    addLandmarkRegions();
    addProperLandmarkRegions();
}

// Create in-page navigation (from HEAD)
export function createInPageNavigation() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length < 2) return;
    
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'In-page navigation');
    
    const ul = document.createElement('ul');
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    nav.appendChild(ul);
    document.body.insertBefore(nav, document.body.firstChild);
}

// Main accessibility function (from origin/main, enhanced with HEAD functions)
export function addressAccessibilityIssues() {
    // Original origin/main functions
    ensureUniqueLandmarks();
    createSvgWithAccessibleName(Array.from(document.querySelectorAll('svg')), 'Icon');
    fixFakeLinks();
    addLandmarkRegions();
    
    // Additional HEAD functions
    addLangAttribute();
    fixTableStructureIssues();
    fixSvgAccessibilityIssues();
    fixReactLandmarkIssue();
    ensureUniqueLandmarksAria();
    fixFakeLinkIssue();
    addProperLandmarkRegions();
    createInPageNavigation();
    addressAccessibilityIssuesFromInsightReport();
}

// ... Kept unchanged