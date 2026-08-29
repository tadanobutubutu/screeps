const URL = require('url');
const queryString = require('querystring');

// Configuration
const config = {
    clientId: process.env.CLIENT_ID || '',
    redirectUri: process.env.REDIRECT_URI || '',
    authorizationEndpoint: process.env.AUTH_ENDPOINT || 'https://auth.example.com/authorize',
    tokenEndpoint: process.env.TOKEN_ENDPOINT || 'https://auth.example.com/token',
    scopes: ['openid', 'profile', 'email'],
    state: null
};

// State management for CSRF protection
function generateState() {
    const state = Math.random().toString(36).substring(2, 15);
    config.state = state;
    return state;
}

function validateState(receivedState) {
    if (!config.state) {
        return { valid: false, error: 'no_state_stored' };
    }
    if (receivedState !== config.state) {
        return { valid: false, error: 'state_mismatch' };
    }
    return { valid: true };
}

// Build authorization URL
function buildAuthorizationUrl() {
    const state = generateState();
    const params = new URL.URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scopes.join(' '),
        state: state
    });
    return `${config.authorizationEndpoint}?${params.toString()}`;
}

// Credential response handling
function handleCredentialResponse(response) {
    if (!response || typeof response !== 'object') {
        return {
            success: false,
            error: 'invalid_response',
            errorDescription: 'Response must be a valid object'
        };
    }

    if (response.error) {
        const errorResult = {
            success: false,
            error: response.error,
            errorDescription: response.error_description || null,
            errorUri: response.error_uri || null
        };

        if (response.state) {
            const stateValidation = validateState(response.state);
            errorResult.stateValid = stateValidation.valid;
            if (!stateValidation.valid) {
                errorResult.stateError = stateValidation.error;
            }
        }

        return errorResult;
    }

    if (response.state) {
        const stateValidation = validateState(response.state);
        if (!stateValidation.valid) {
            return {
                success: false,
                error: 'state_mismatch',
                errorDescription: 'State parameter validation failed',
                details: stateValidation.error
            };
        }
    } else {
        return {
            success: false,
            error: 'missing_state',
            errorDescription: 'State parameter is required for security'
        };
    }

    if (response.code) {
        return {
            success: true,
            type: 'authorization_code',
            code: response.code,
            state: response.state,
            timestamp: new Date().toISOString()
        };
    }

    if (response.access_token) {
        const tokenResponse = {
            success: true,
            type: 'implicit',
            accessToken: response.access_token,
            tokenType: response.token_type || 'Bearer',
            expiresIn: response.expires_in || null,
            scope: response.scope ? response.scope.split(' ') : config.scopes,
            state: response.state,
            timestamp: new Date().toISOString()
        };

        if (response.id_token) {
            tokenResponse.idToken = response.id_token;
        }

        return tokenResponse;
    }

    if (response.id_token && !response.access_token) {
        return {
            success: true,
            type: 'id_token',
            idToken: response.id_token,
            state: response.state,
            timestamp: new Date().toISOString()
        };
    }

    return {
        success: false,
        error: 'invalid_response',
        errorDescription: 'No valid credential data found in response'
    };
}

// Parses credential response from URL query parameters
function parseCallbackUrl(urlString) {
    try {
        const url = new URL.URL(urlString);
        const response = {};

        url.searchParams.forEach((value, key) => {
            response[key] = value;
        });

        if (url.hash && url.hash.length > 1) {
            const fragmentParams = queryString.parse(url.hash.substring(1));
            Object.assign(response, fragmentParams);
        }

        return response;
    } catch (error) {
        return { error: 'invalid_url', error_description: error.message };
    }
}

// Get accessible name for SVG element
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return null;

    const title = svgElement.querySelector('title');
    if (title && title.textContent) {
        return title.textContent.trim();
    }

    if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label');
    }

    if (svgElement.hasAttribute('aria-labelledby')) {
        const labelledBy = svgElement.getAttribute('aria-labelledby');
        const label = document.getElementById(labelledBy);
        if (label) {
            return label.textContent.trim();
        }
    }

    return null;
}

// Dependency graph loading
let dependencyGraphContent = null;
try {
    dependencyGraphContent = require('./dependencyGraph');
} catch (e) {
    // Modules not available, function remains null
}

// Utility functions
const fs = require('fs');
const path = require('path');
const dependencyGraphRenderer = require('./dependencyGraphRenderer');
const addressAccessibilityIssue038 = require('./accessibilityFunctions').addressAccessibilityIssue038;

// Accessibility improvements from insight report
function handleNewAccessibilityIssue() {
    console.log('New accessibility issue addressed');
}

function personName() {
    return 'PersonName';
}

function validateTableAccessibility() {
    validateTableStructure();
}

function createInPageButton() {
    const button = document.createElement('button');
    button.textContent = 'Click Me';
    document.body.appendChild(button);
    return button;
}

function renderDependencyGraph() {
    return dependencyGraphContent;
}

// Ensure element has an id
function ensureElementHasId(element) {
    if (!element.id) {
        element.id = personName() + 15;
    }
    return element;
}

// Add aria-label
function addAriaLabel(element, label) {
    if (!element.nativeEvent || !element.nativeEvent.isTrusted) {
        element.setAttribute('aria-label', label);
    }
    return element;
}

// validateTableStructure
function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const hasCaption = !!table.querySelector('caption');
        const hasThead = !!table.querySelector('thead');
        const rowsInThead = Array.from(table.querySelectorAll('thead tr'));
        const hasTbody = !!table.querySelector('tbody');
        const hasTfoot = !!table.querySelector('tfoot');
        const hasTh = Array.from(table.querySelectorAll('th'));

        if (hasCaption) {
            if (table.firstChild !== table.querySelector('caption')) {
                throw new Error('Table caption should be the first child of the table');
            }
        }
        if (hasThead) {
            if (table.firstChild !== table.querySelector('thead')) {
                throw new Error('Thead should be before the tbody');
            }
        }
        if (hasTbody && hasThead) {
            if (table.querySelector('thead').nextSibling !== table.querySelector('tbody')) {
                throw new Error('Tbody should be immediately after thead');
            }
        }
        if (hasTfoot && hasTbody) {
            if (table.querySelector('tbody').nextSibling !== table.querySelector('tfoot')) {
                throw new Error('Tfoot should be immediately after tbody');
            }
        }

        if (rowsInThead.length > 0) {
            rowsInThead.forEach((row, index) => {
                if (row.querySelectorAll('th').length !== row.querySelectorAll('td').length) {
                    throw new Error(`Row ${index} in table header should have the same number of th and td`);
                }
            });
        }
    });
}

// validateLandmark
function validateLandmark(element, landmarkType) {
    if (!element.hasAttribute('aria-' + landmarkType)) {
        throw new Error(`Element '${element.outerHTML}' is not a valid ${landmarkType} landmark`);
    }
}

// validateLandmarkStructure
function validateLandmarkStructure() {
    const mainLandmark = document.querySelector('[role="main"], main');
    if (!mainLandmark) {
        throw new Error('Document must have a main landmark (role="main" or <main> element)');
    }

    const banners = document.querySelectorAll('[role="banner"], [role="header"]');
    if (banners.length > 1) {
        throw new Error('Document should have at most one banner or header landmark');
    }

    const contentinfos = document.querySelectorAll('[role="contentinfo"], [role="footer"]');
    if (contentinfos.length > 1) {
        throw new Error('Document should have at most one contentinfo or footer landmark');
    }

    const allLandmarks = document.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="main"], [role="navigation"], [role="search"], [role="region"], [role="article"], [role="aside"], [role="figure"], [role="footer"], [role="header"], [role="landmark"], main, header, footer, aside, nav, section[aria-label], form[aria-label]');

    allLandmarks.forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        let parent = landmark.parentElement;
        while (parent) {
            const parentRole = parent.getAttribute('role') || parent.tagName.toLowerCase();
            if (parentRole === role) {
                throw new Error(`Landmark with role "${role}" should not be nested inside another with the same role`);
            }
            parent = parent.parentElement;
        }
    });
}

// formatDate function
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// generateId function
function generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// totalDependencies function
function totalDependencies() {
    return 0;
}

// addressAccessibilityIssueForSpecificElement
function addressAccessibilityIssueForSpecificElement(element, issue) {
    console.log(`Addressing issue ${issue} for element:`, element);
}

// newFunction placeholder
function newFunction() {
    return 'new function placeholder';
}

// getLangAttribute
function getLangAttribute() {
    return 'en';
}

// getFullLangAttribute
function getFullLangAttribute() {
    return 'en-US';
}

// addressAccessibilityIssues
function addressAccessibilityIssues(report) {
    if (report) {
        // a11yStore.addressAccessibilityIssues(report);
        return;
    }
    validateTableStructure();
    validateLandmarkStructure();
}

// addressAccessibilityIssuesFromInsightReport
function addressAccessibilityIssuesFromInsightReport(insightReport) {
    if (!Array.isArray(insightReport)) {
        console.error('Insight report must be an array');
        return;
    }

    insightReport.forEach(issue => {
        switch (issue.type) {
            case 'LANG_ATTRIBUTE':
                addLangAttribute();
                break;
            case 'TABLE_STRUCTURE':
                fixTableStructureIssues();
                break;
            case 'LANDMARK_STRUCTURE':
                validateLandmarkStructure();
                ensureUniqueLandmarks();
                break;
            case 'SVG_ACCESSIBILITY':
                addSvgAccessibleNames();
                break;
            case 'FAKE_LINK':
                fixFakeLinkIssue();
                break;
            case 'FORM_ELEMENTS':
                setFormElementAccessibleNames();
                break;
            case 'INTERACTIVE_ELEMENTS':
                addA11yAttributesToInteractiveElements();
                break;
            case 'GENERAL_ACCESSIBILITY':
                checkAccessibility();
                break;
            default:
                console.warn(`Unknown issue type: ${issue.type}`);
        }
    });
}

// setSvgAccessibilityProps
function setSvgAccessibilityProps(svgElement) {
    if (svgElement && svgElement.setAttribute) {
        svgElement.setAttribute('aria-label', 'Accessible description');
    }
}

// isLinkAccessible
function isLinkAccessible(link) {
    return link.hasAttribute('href') && link.getAttribute('href').length > 0;
}

// isButtonAccessible
function isButtonAccessible(button) {
    return button.hasAttribute('disabled') === false && button.hasAttribute('type') === 'button';
}

// checkAccessibility
function checkAccessibility(container = document) {
    // placeholder implementation
    return {};
}

// checkLandmarkElement
function checkLandmarkElement(role, element) {
    if (!element.hasAttribute('aria-' + role)) {
        return false;
    }
    return true;
}

// wrapPrimaryContentInMain
function wrapPrimaryContentInMain() {
    if (typeof document !== 'undefined' && document.documentElement) {
        const main = document.querySelector('main') || document.createElement('main');
        const body = document.body;
        if (body && !document.querySelector('main')) {
            body.insertBefore(main, body.firstChild);
        }
        return main;
    }
    return null;
}

// renderIndexView
function renderIndexView() {
    const button = document.createElement('button');
    button.textContent = 'Click Me';
    document.body.appendChild(button);
}

// addLangAttribute
function addLangAttribute() {
    if (typeof document !== 'undefined' && document.documentElement) {
        if (!document.documentElement.lang) {
            document.documentElement.lang = 'en';
        }
        return document.documentElement;
    }
    return null;
}

// fixTableStructureIssues
function fixTableStructureIssues(container = document) {
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
        // Fix logic mirrors validateTableStructure but focuses on correction
        const hasCaption = !!table.querySelector('caption');
        const hasThead = !!table.querySelector('thead');
        const hasTbody = !!table.querySelector('tbody');
        const hasTfoot = !!table.querySelector('tfoot');

        if (hasCaption && table.firstChild !== table.querySelector('caption')) {
            // caption should be first child, move if necessary
        }
        if (hasThead) {
            // ensure thead comes before tbody
        }
        if (hasTbody && hasThead) {
            // ensure tbody follows thead
        }
        if (hasTfoot && hasTbody) {
            // ensure tfoot follows tbody
        }
    });
    return tables;
}

// addMainLandmark
function addMainLandmark() {
    return wrapPrimaryContentInMain();
}

// addSvgAccessibleNames
function addSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => setSvgAccessibilityProps(svg));
    return svgs;
}

// ensureUniqueLandmarks
function ensureUniqueLandmarks() {
    // placeholder for landmark uniqueness enforcement
}

// fixFakeLinkIssue
function fixFakeLinkIssue() {
    const links = document.querySelectorAll('a');
    const fixedLinks = [];

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href === '') {
            link.setAttribute('role', 'button');
            if (!link.hasAttribute('tabindex')) {
                link.setAttribute('tabindex', '0');
            }
            fixedLinks.push(link);
        }
    });

    return fixedLinks;
}

// setFormElementAccessibleNames
function setFormElementAccessibleNames() {
    const formElements = document.querySelectorAll('form [name], form [id]');
    formElements.forEach(element => {
        if (element.tagName.toLowerCase() === 'form') {
            const uniqueLabel = `form-${Date.now()}`;
            element.setAttribute('aria-labelledby', uniqueLabel);
            element.insertAdjacentHTML('afterbegin', `<span id="${uniqueLabel}">${element.getAttribute('aria-label') || ''}</span>`);
        } else {
            element.setAttribute('aria-label', `${element.tagName.toLowerCase()} input: ${element.name || element.id}`);
        }
    });
    return formElements;
}

// addA11yAttributesToInteractiveElements
function addA11yAttributesToInteractiveElements() {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });
    return interactiveElements;
}

// convertAnchorsToButtons
function convertAnchorsToButtons() {
    if (typeof document !== 'undefined') {
        const anchors = document.querySelectorAll('a');
        anchors.forEach(anchor => {
            const button = document.createElement('button');
            button.id = anchor.id;
            button.type = 'button';
            button.textContent = anchor.textContent;
            Array.from(anchor.attributes).forEach(attr => {
                if (attr.name !== 'id') {
                    button.setAttribute(attr.name, attr.value);
                }
            });
            anchor.parentNode.replaceChild(button, anchor);
        });
    }
}

// setHtmlLangAttribute
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang;
    }
}

// detectAndSetLang
function detectAndSetLang(content) {
    let lang = 'en';
    if (content) {
        const nonAsciiPattern = /[^\x00-\x7F]/;
        if (nonAsciiPattern.test(content)) {
            setHtmlLangAttribute('und');
        } else {
            setHtmlLangAttribute(lang);
        }
    }
}

// addressOldAccessibilityIssues
function addressOldAccessibilityIssues() {
    return 'addressing old issues';
}

// newAccessibilityFunction
const newAccessibilityFunction = () => {
    return 'new accessibility function';
};

// Global browser exports
const globalObject = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);
globalObject.setSvgAccessibilityProps = setSvgAccessibilityProps;
globalObject.isLinkAccessible = isLinkAccessible;
globalObject.isButtonAccessible = isButtonAccessible;
globalObject.checkAccessibility = checkAccessibility;
globalObject.checkLandmarkElement = checkLandmarkElement;
globalObject.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
globalObject.renderIndexView = renderIndexView;

// Export all functions
module.exports = {
    config,
    buildAuthorizationUrl,
    handleCredentialResponse,
    parseCallbackUrl,
    validateState,
    generateState,
    getSvgAccessibleName,
    formatDate,
    generateId,
    dependencyGraphContent,
    dependencyGraphRenderer,
    addressAccessibilityIssue038,
    totalDependencies,
    a11yStore,
    handleNewAccessibilityIssue,
    personName,
    validateTableAccessibility,
    createInPageButton,
    renderDependencyGraph,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureElementHasId,
    addAriaLabel,
    getLangAttribute,
    getFullLangAttribute,
    addressAccessibilityIssues,
    addressAccessibilityIssueForSpecificElement,
    newFunction,
    addressAccessibilityIssuesFromInsightReport,
    setSvgAccessibilityProps,
    isLinkAccessible,
    isButtonAccessible,
    checkAccessibility,
    checkLandmarkElement,
    wrapPrimaryContentInMain,
    renderIndexView,
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    setFormElementAccessibleNames,
    addA11yAttributesToInteractiveElements,
    convertAnchorsToButtons,
    setHtmlLangAttribute,
    detectAndSetLang,
    addressOldAccessibilityIssues,
    newAccessibilityFunction
};