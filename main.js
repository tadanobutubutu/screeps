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
    return svg.getAttribute('aria-label') || 
           svg.getAttribute('aria-labelledby') || 
           svg.querySelector('title')?.textContent || 
           'Icon';
}

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
    const toFix = Array.from(svgs).filter(svg => !svg.getAttribute('aria-label') && !svg.querySelector('title'));
    toFix.slice(0, 2).forEach(svg => {
        const name = svg.getAttribute('aria-label') || svg.getAttribute('data-icon-name') || 'Icon';
        svg.setAttribute('aria-label', name);
        const title = document.createElement('title');
        title.textContent = name;
        svg.insertBefore(title, svg.firstChild);
    });
}

// Fix REACT_025 & REACT_017: Use semantic landmark elements
export function validateLandmark(element) {
    if (!element) return { valid: false, role: null };
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();
    const validRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'region'];
    const semanticTags = ['header', 'nav', 'main', 'footer', 'aside', 'section'];
    
    if (role && validRoles.includes(role)) {
        return { valid: true, role };
    }
    if (semanticTags.includes(tagName)) {
        return { valid: true, role: tagName };
    }
    return { valid: false, role: null };
}

export function validateLandmarkStructure(container = document) {
    const landmarks = container.querySelectorAll('header, nav, main, footer, aside, section');
    const issues = [];
    const seenIds = new Set();
    landmarks.forEach(landmark => {
        if (landmark.id) {
            if (seenIds.has(landmark.id)) {
                issues.push(`Duplicate landmark id: ${landmark.id}`);
            }
            seenIds.add(landmark.id);
        }
    });
    return { valid: issues.length === 0, issues };
}

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
export function createInPageButton(link) {
    if (!link) return null;
    return {
        href: link.href,
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

function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"], a[role="button"]');
    fakeLinks.forEach(link => {
        link.href = link.href || '#';
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
                    role: 'navigation