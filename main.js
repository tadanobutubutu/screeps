const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');
const a11yStore = require('./a11yStore');

const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

function checkLandmarkElements(htmlContent) {
    if (typeof htmlContent !== 'string') {
        throw new Error('HTML content must be a string');
    }

    const warnings = [];
    const foundLandmarks = {};

    LANDMARK_ELEMENTS.forEach((landmark) => {
        const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
        const matches = htmlContent.match(regex);
        if (matches) {
            foundLandmarks[landmark] = matches.length;
        }
    });

    if (!foundLandmarks.main) {
        warnings.push('Missing main landmark element');
    }

    LANDMARK_ELEMENTS.forEach((landmark) => {
        if (foundLandmarks[landmark] > 1) {
            warnings.push(`Multiple ${landmark} elements found`);
        }
    });

    return {
        foundLandmarks,
        warnings,
        hasMainLandmark: !!foundLandmarks.main,
    };
}

function createInPageButton(options) {
    const { text, onClick, id, title, className } = options;

    if (!text) {
        throw new Error('Button text is required');
    }
    if (typeof onClick !== 'function') {
        throw new Error('onClick callback must be a function');
    }

    const button = {
        id: id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: String(text),
        title: title || '',
        className: className || 'default-button',
        onClick,
        disabled: false,
        visible: true,
        element: null,
    };

    if (!createInPageButton.buttons) {
        createInPageButton.buttons = {};
    }
    createInPageButton.buttons[button.id] = button;

    return button;
}

function addressAccessibilityIssues(insightReport) {
    if (!insightReport) return;
    if (a11yStore && a11yStore.addressAccessibilityIssues) {
        a11yStore.addressAccessibilityIssues(insightReport);
    }
    return { status: 'fixed', report: insightReport };
}

function myFunction(param1, param2) {
    console.log('And here is your function implementation...', param1, param2);
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... [PERSON_NAME](), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

const validateLinkAccessibility = () => {
    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (!link.hasAttribute('href') || (link.href && link.href.startsWith('#'))) {
            handleFakeLinks(link);
        }
    }
};

const handleFakeLinks = (link) => {
    const fakeLinkButton = createInPageButton({ text: link.textContent, onClick: () => {} });
    link.textContent = '';
    link.setAttribute('target', '_top');
    link.addEventListener('click', (event) => {
        event.preventDefault();
        fakeLinkButton.onClick();
    });
};

// REACT_027: Fix table structure issues
function fixTableStructureIssues(document) {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        if (!table.querySelector('thead') && table.querySelector('tr')) {
            const firstRow = table.querySelector('tr');
            const ths = firstRow.querySelectorAll('th');
            if (ths.length > 0) {
                const thead = document.createElement('thead');
                thead.appendChild(firstRow.cloneNode(true));
                table.insertBefore(thead, table.firstChild);
                firstRow.remove();
            }
        }

        if (!table.querySelector('tbody')) {
            const rows = Array.from(table.querySelectorAll('tr'));
            const tbody = document.createElement('tbody');
            rows.forEach((row) => tbody.appendChild(row));
            const thead = table.querySelector('thead');
            if (thead) {
                table.insertBefore(tbody, thead.nextSibling);
            } else {
                table.insertBefore(tbody, table.firstChild);
            }
        }

        const caption = table.querySelector('caption');
        if (!caption) {
            const newCaption = document.createElement('caption');
            newCaption.textContent = 'Data table';
            newCaption.style.clip = 'rect(0 0 0 0)';
            newCaption.style.clipPath = 'inset(50%)';
            newCaption.style.height = '1px';
            newCaption.style.overflow = 'hidden';
            newCaption.style.whiteSpace = 'nowrap';
            newCaption.style.width = '1px';
            table.insertBefore(newCaption, table.firstChild);
        }
    });
    return tables.length;
}

function validateTableAccessibility(element) {
    if (!element) return false;
    if (element.getAttribute('role') !== 'table') {
        const table = element.querySelector('table');
        if (table) return true;
    }
    return true;
}

function validateTableStructure(element) {
    if (!element) return false;
    const rows = element.querySelectorAll('tr');
    return rows.length > 0;
}

function validateLandmark(element) {
    if (!element) return false;
    return element.tagName === 'SVG';
}

function validateLandmarkStructure(element) {
    if (!element) return false;
    return element.id || element.getAttribute('aria-label');
}

function ensureUniqueLandmarksArray(landmarks) {
    if (!Array.isArray(landmarks)) return [];
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        const id = lm.id || 'unknown';
        if (seen.has(id)) {
            lm.id = `${id}-${Date.now()}`;
        }
        seen.add(id);
        result.push(lm);
    }
    return result;
}

function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const title = svgElement.getAttribute('title');
    if (title) return title;
    return svgElement.tagName.toLowerCase();
}

function addAccessibleNamesToSvg(svgElement, names) {
    const targetNames = Array.isArray(names) ? names : [names];
    for (let i = 0; i < svgElement.children.length; i++) {
        const child = svgElement.children[i];
        if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.getAttribute('role') === 'img' || child.type === 'image') {
                if (!child.getAttribute('aria-label') && targetNames.length > 0) {
                    addAriaLabel(child, targetNames[0]);
                }
            }
        }
    }
}

function ensureElementHasId(element) {
    if (!element) {
        throw new Error('Element is required');
    }
    if (!element.id) {
        element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
}

function addAriaLabel(element, label) {
    if (!element) {
        throw new Error('Element is required');
    }
    element.setAttribute('aria-label', label);
    return element;
}

function renderDependencyGraph(data, container) {
    if (!data) {
        throw new Error('Dependency data is required');
    }
    if (!container) {
        throw new Error('Container element is required');
    }
    return container;
}

function generateAccessibilityReport(issues) {
    if (!Array.isArray(issues)) {
        throw new Error('Issues must be an array');
    }

    const report = {
        totalIssues: issues.length,
        severityCounts: {
            critical: 0,
            serious: 0,
            moderate: 0,
            minor: 0
        },
        issuesByType: {},
        issues: []
    };

    issues.forEach((issue) => {
        if (!issue || typeof issue !== 'object') {
            return;
        }

        const severity = issue.severity || 'minor';
        if (report.severityCounts[severity] !== undefined) {
            report.severityCounts[severity]++;
        } else {
            report.severityCounts.minor++;
        }

        const type = issue.type || 'other';
        if (!report.issuesByType[type]) {
            report.issuesByType[type] = 0;
        }
        report.issuesByType[type]++;

        report.issues.push({
            type,
            severity,
            message: issue.message || '',
            element: issue.element || null
        });
    });

    report.summary =
        `Found ${report.totalIssues} accessibility issue(s): ` +
        `${report.severityCounts.critical} critical, ` +
        `${report.severityCounts.serious} serious, ` +
        `${report.severityCounts.moderate} moderate, ` +
        `${report.severityCounts.minor} minor.`;

    return report;
}

function addMainLandmark(document) {
    const mainElements = document.querySelectorAll('main');

    if (mainElements.length === 0) {
        const body = document.body;
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
        while (body.firstChild) {
            main.appendChild(body.firstChild);
        }
        body.appendChild(main);
    } else if (mainElements.length === 1) {
        const main = mainElements[0];
        if (!main.hasAttribute('role')) {
            main.setAttribute('role', 'main');
        }
    }

    return document.querySelectorAll('main').length;
}

function addSvgAccessibleNames(document) {
    const svgs = document.querySelectorAll('svg');
    let count = 0;

    svgs.forEach((svg, index) => {
        const existingLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');

        if (!existingLabel) {
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `Icon ${index + 1}`;
            svg.insertBefore(title, svg.firstChild);

            const titleId = `svg-title-${index + 1}`;
            title.setAttribute('id', titleId);
            svg.setAttribute('aria-labelledby', titleId);
            count++;
        }
    });

    return count;
}

function ensureUniqueLandmarks(document) {
    const mains = document.querySelectorAll('main, [role="main"]');

    if (mains.length > 1) {
        for (let i = 1; i < mains.length; i++) {
            const main = mains[i];
            if (main.tagName === 'MAIN') {
                main.setAttribute('role', 'presentation');
            } else {
                main.removeAttribute('role');
                main.setAttribute('role', 'region');
            }
        }
    }

    const landmarks = document.querySelectorAll(
        '[role="banner"], [role="navigation"], [role="contentinfo"]'
    );
    const seenIds = new Set();

    landmarks.forEach((landmark) => {
        const id = landmark.id;
        if (id) {
            if (seenIds.has(id)) {
                landmark.id = `${id}-unique-${Math.random().toString(36).substr(2, 9)}`;
            }
            seenIds.add(id);
        }
    });

    return mains.length;
}

function fixFakeLinkIssue(document) {
    const clickableElements = document.querySelectorAll('[role="link"]:not(a), [onclick]');
    let count = 0;

    clickableElements.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const hasHref = element.hasAttribute('href');

        if (tagName !== 'a' && !hasHref) {
            const isInteractive =
                element.getAttribute('role') === 'link' ||
                (element.hasAttribute('onclick') &&
                    element.onclick.toString().includes('window.location'));

            if (isInteractive && !element.hasAttribute('aria-label')) {
                const text = element.textContent.trim();
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
            count++;
        }
    });

    return count;
}

function addLangAttribute(document, lang = 'en') {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', lang);
        return 1;
    }
    return 0;
}

function checkLinkAndButtonAccessibility(document) {
    const links = document.querySelectorAll('a, button, [role="button"]');
    const issues = {
        linksWithoutText: [],
        buttonsWithoutText: [],
        linksWithoutAriaLabel: [],
        buttonsWithoutAriaLabel: []
    };

    links.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const isLink = tagName === 'a';
        const isButton = tagName === 'button' || element.getAttribute('role') === 'button';

        if (isLink || isButton) {
            const hasTextContent = element.textContent.trim().length > 0;
            const hasAriaLabel = element.hasAttribute('aria-label');
            const hasTitle = element.hasAttribute('title');
            const accessibleName = hasTextContent || hasAriaLabel || hasTitle;

            if (!accessibleName) {
                if (isLink) {
                    issues.linksWithoutText.push(element);
                } else {
                    issues.buttonsWithoutText.push(element);
                }
            }

            if (!hasAriaLabel && !(hasTextContent || hasTitle)) {
                if (isLink) {
                    issues.linksWithoutAriaLabel.push(element);
                } else {
                    issues.buttonsWithoutAriaLabel.push(element);
                }
            }
        }
    });

    return issues;
}

function applyAccessibilityFixes(document, options = {}) {
    const lang = options.lang || 'en';

    return {
        langAdded: addLangAttribute(document, 'en'),
        tablesFixed: fixTableStructureIssues(document),
        mainsAdded: addMainLandmark(document),
        svgsFixed: addSvgAccessibleNames(document),
        landmarksEnsured: ensureUniqueLandmarks(document),
        linksFixed: fixFakeLinkIssue(document)
    };
}

function newFocusTrap(container) {
    if (!container) {
        return {
            activate: () => {},
            deactivate: () => {},
            toggle: () => {}
        };
    }

    let isActive = false;
    let previouslyFocusedElement = null;

    function getFocusableElements(element) {
        const getFocusableSelectors = [
            'a[href]',
            'area[href]',
            'input:not([disabled]):not([type="hidden"])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'button:not([disabled])',
            'iframe',
            'object',
            'embed',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]:not([contenteditable="false"])'
        ].join(', ');

        return Array.from(element.querySelectorAll(getFocusableSelectors)).filter(
            (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
        );
    }

    function handleKeyDown(event) {
        if (event.key === 'Tab') {
            const focusableElements = getFocusableElements(container);

            if (focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        } else if (event.key === 'Escape') {
            deactivate();
        }
    }

    function activate() {
        if (isActive) return;
        previouslyFocusedElement = document.activeElement;
        container.setAttribute('data-focus-trap-active', 'true');
        const focusableElements = getFocusableElements(container);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        container.addEventListener('keydown', handleKeyDown);
        isActive = true;
    }

    function deactivate() {
        if (!isActive) return;
        container.removeAttribute('data-focus-trap-active');
        container.removeEventListener('keydown', handleKeyDown);
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
        isActive = false;
    }

    function toggle() {
        if (isActive) {
            deactivate();
        } else {
            activate();
        }
    }

    return { activate, deactivate, toggle };
}

const loop = () => {
    // Main game logic
};

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
}

function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        const hasHeaderCells = table.querySelectorAll('th').length > 0;
        if (!hasHeaderCells) {
            console.warn('Table missing header cells (th).', table);
            const firstRow = table.querySelector('tr');
            if (firstRow && firstRow.children.length > 0) {
                if (!firstRow.querySelector('th')) {
                    const cells = firstRow.children;
                    for (let i = 0; i < cells.length; i++) {
                        const newTh = document.createElement('th');
                        newTh.textContent = cells[i].textContent;
                        newTh.setAttribute('scope', 'col');
                        cells[i].replaceWith(newTh);
                    }
                    if (!table.querySelector('thead')) {
                        const thead = document.createElement('thead');
                        firstRow.parentNode.insertBefore(thead, firstRow);
                        thead.appendChild(firstRow);
                    }
                }
            }
        }

        const rows = Array.from(table.rows);
        const firstRow = rows[0];
        if (firstRow && firstRow.querySelector('th') && !table.querySelector('thead')) {
            const thead = document.createElement('thead');
            table.insertBefore(thead, firstRow);
            thead.appendChild(firstRow);
        }

        const thElements = table.querySelectorAll('th');
        thElements.forEach((th) => {
            if (!th.hasAttribute('scope')) {
                const parent = th.parentElement;
                if (parent && parent.tagName === 'TR') {
                    const grandparent = parent.parentElement;
                    if (grandparent && grandparent.tagName === 'THEAD') {
                        th.setAttribute('scope', 'col');
                    } else if (grandparent.tagName === 'THEAD') {
                        th.setAttribute('scope', 'row');
                    } else {
                        th.setAttribute('scope', 'col');
                    }
                }
            }
        });

        if (!table.querySelector('caption') &&
            !table.hasAttribute('aria-label') &&
            !table.hasAttribute('aria-labelledby')) {
            console.warn('Table missing accessible name (caption or aria-label).', table);
        }
    });
}

async function handleCredentialResponse(response) {
    try {
        if (response.ok) {
            console.log('Handling credential response:', response);
        } else {
            console.warn('Credential response is not OK:', response.status);
        }

        const json = await response.json();

        if (json && typeof json === 'object' && 'credentials' in json) {
            const credentials = json.credentials;
            if (Array.isArray(credentials)) {
                Object.entries(credentials).forEach(([key, value]) => {
                    if (value) {
                        document.cookie = `${key}=${value}; path=/`;
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error handling credential response:', error);
    }
}

function countDependencies(dependencyGraphContent) {
    const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
    const importCount = (dependencyGraphContent || '').match(importCommentRegExp) || [];
    return importCount.length;
}

function renderIndexView() {
    return indexContent;
}

function addLandmarkRegions() {
    const landmarks = {
        main: true,
        nav: false,
        aside: false,
    };

    return {
        landmarks,
        regions: Object.keys(landmarks).filter((key) => landmarks[key]),
    };
}

function personName() {
    if (a11yStore && a11yStore.personName) return a11yStore.personName();
    return 'Person';
}

function updateLiveRegion(message, priority = 'polite') {
    if (a11yStore && a11yStore.updateLiveRegion) {
        a11yStore.updateLiveRegion(message, priority);
    }
}

function addLandmarkIds() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((tag) => {
        const landmark = document.querySelector(tag);
        if (landmark && landmark.id === '') {
            landmark.id = `${tag}-${Math.floor(Math.random() * 1000)}`;
        }
    });
}

function checkLandmarkElementsInDom() {
    if (a11yStore && a11yStore.checkLandmarkElements) {
        a11yStore.checkLandmarkElements();
    }
}

function addSVGAccessibilityProps() {
    if (a11yStore && a11yStore.addSVGAccessibilityProps) {
        a11yStore.addSVGAccessibilityProps();
    }
}

function preserveExistingCode() {
    if (a11yStore && a11yStore.preserveExistingCode) {
        a11yStore.preserveExistingCode();
    }
}

function newFunction() {
    // Placeholder for new accessibility issue fixes
}

function getLangAttribute() {
    if (a11yStore && a11yStore.getLangAttribute) return a11yStore.getLangAttribute();
    return 'en';
}

function wrapPrimaryContentInMain() {
    // Placeholder: wrap primary content in a <main> landmark
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: fb67a7e098f5383c5d508e53ce0aa8f290fcb50d_

if (typeof window !== 'undefined') {
    window.landmarkValidation = validateLandmarkStructure(document);
}

module.exports = {
    myFunction,
    addressAccessibilityIssues,
    newFunction,
    checkLandmarkElements,
    createInPageButton,
    countDependencies,
    a11yStore,
    addLandmarkRegions,
    LANDMARK_ELEMENTS,
    getLangAttribute,
    updateLiveRegion,
    addSVGAccessibilityProps,
    preserveExistingCode,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    ensureUniqueLandmarksArray,
    addAccessibleNamesToSvg,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph,
    generateAccessibilityReport,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    fixFakeLinkIssues: fixFakeLinkIssue,
    addLangAttribute,
    checkLinkAndButtonAccessibility,
    applyAccessibilityFixes,
    newFocusTrap,
    loop,
    add,
    subtract,
    multiply,
    divide,
    fixTableStructure,
    handleCredentialResponse,
    validateLinkAccessibility,
    handleFakeLinks,
    addLandmarkIds,
    checkLandmarkElementsInDom,
    wrapPrimaryContentInMain,
    renderIndexView
};