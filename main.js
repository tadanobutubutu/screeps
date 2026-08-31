// TODO: Add any new functions or changes requested in the issue here

/**
 * Checks if all form inputs in the document have associated labels
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Array} List of inputs without labels
 */
function checkFormLabels(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return [];
    
    const inputs = root.querySelectorAll('input, select, textarea, button');
    const unlabeled = [];
    
    inputs.forEach(input => {
        const hasLabel = input.closest('label') || 
                        input.hasAttribute('aria-label') || 
                        input.hasAttribute('title');
        
        if (!hasLabel) {
            unlabeled.push({
                element: input,
                type: input.type || input.tagName.toLowerCase(),
                id: input.id || 'no-id'
            });
        }
    });
    
    return unlabeled;
}

/**
 * Ensures proper heading hierarchy by checking h1-h6 usage
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Object} Heading hierarchy analysis
 */
function validateHeadingHierarchy(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return null;
    
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const hierarchy = Array.from(headings).map(h => ({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent.trim(),
        id: h.id || 'no-id'
    }));
    
    const analysis = {
        totalHeadings: hierarchy.length,
        h1Count: hierarchy.filter(h => h.level === 1).length,
        hierarchyIssues: []
    };
    
    // Check if there's only one h1 per page
    if (analysis.h1Count > 1) {
        analysis.hierarchyIssues.push({
            issue: 'Multiple h1 elements found',
            severity: 'moderate'
        });
    }
    
    // Check heading order
    let lastLevel = 0;
    hierarchy.forEach((h, index) => {
        if (index > 0) {
            if (h.level > lastLevel + 1) {
                analysis.hierarchyIssues.push({
                    issue: `Jump from h${lastLevel} to h${h.level} at index ${index}`,
                    severity: 'moderate'
                });
            }
        }
        lastLevel = h.level;
    });
    
    return analysis;
}

/**
 * Checks for color contrast issues (basic implementation)
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Array} List of potential contrast issues
 */
function checkColorContrast(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return [];
    
    const elements = root.querySelectorAll('*');
    const issues = [];
    
    elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Skip if elements have no color or background color
        if (color === 'rgba(0, 0, 0, 0)' || backgroundColor === 'rgba(0, 0, 0, 0)') {
            return;
        }
        
        // Simple contrast check (you might want to use a more sophisticated library)
        const luminance = (color) => {
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;
            const [r, g, b] = rgb.map(c => {
                c = parseInt(c);
                return (c <= 0.03928) ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        
        try {
            const contrast = Math.abs(luminance(color) - luminance(backgroundColor));
            if (contrast < 0.5) { // Simplified threshold
                issues.push({
                    element: el,
                    contrast: contrast,
                    color: color,
                    backgroundColor: backgroundColor
                });
            }
        } catch (e) {
            // If we can't parse colors, skip
        }
    });
    
    return issues;
}

/**
 * Generates a comprehensive accessibility audit report
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Object} Comprehensive accessibility report
 */
function generateAccessibilityAudit(root = (typeof document !== 'undefined' ? document : null)) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalIssues: 0,
            critical: 0,
            moderate: 0,
            minor: 0,
            passed: 0
        },
        categories: {
            forms: { issues: 0, passed: 0 },
            headings: { issues: 0, passed: 0 },
            contrast: { issues: 0, passed: 0 },
            landmarks: { issues: 0, passed: 0 },
            tables: { issues: 0, passed: 0 },
            links: { issues: 0, passed: 0 }
        },
        issues: [],
        passed: []
    };
    
    // Check form labels
    try {
        const unlabeledInputs = checkFormLabels(root);
        if (unlabeledInputs.length > 0) {
            report.categories.forms.issues = unlabeledInputs.length;
            report.summary.totalIssues += unlabeledInputs.length;
            report.summary.moderate += unlabeledInputs.length;
            
            unlabeledInputs.forEach(input => {
                report.issues.push({
                    category: 'Form Labels',
                    message: `Input ${input.id} (${input.type}) lacks an associated label`,
                    element: input.element,
                    severity: 'moderate'
                });
            });
        } else {
            report.categories.forms.passed = 1;
            report.summary.passed++;
            report.passed.push({
                category: 'Form Labels',
                message: 'All form inputs have associated labels'
            });
        }
    } catch (e) {
        console.error('Error checking form labels:', e);
    }
    
    // Check heading hierarchy
    try {
        const headingAnalysis = validateHeadingHierarchy(root);
        if (headingAnalysis) {
            if (headingAnalysis.hierarchyIssues.length > 0) {
                report.categories.headings.issues = headingAnalysis.hierarchyIssues.length;
                report.summary.totalIssues += headingAnalysis.hierarchyIssues.length;
                report.summary.moderate += headingAnalysis.hierarchyIssues.length;
                
                headingAnalysis.hierarchyIssues.forEach(issue => {
                    report.issues.push({
                        category: 'Heading Hierarchy',
                        message: issue.issue,
                        severity: issue.severity
                    });
                });
            } else {
                report.categories.headings.passed = 1;
                report.summary.passed++;
                report.passed.push({
                    category: 'Heading Hierarchy',
                    message: 'Heading hierarchy is valid'
                });
            }
        }
    } catch (e) {
        console.error('Error checking heading hierarchy:', e);
    }
    
    // Check color contrast
    try {
        const contrastIssues = checkColorContrast(root);
        if (contrastIssues.length > 0) {
            report.categories.contrast.issues = contrastIssues.length;
            report.summary.totalIssues += contrastIssues.length;
            report.summary.minor += contrastIssues.length;
            
            contrastIssues.forEach(issue => {
                report.issues.push({
                    category: 'Color Contrast',
                    message: `Potential contrast issue: contrast ratio ${issue.contrast.toFixed(2)}`,
                    element: issue.element,
                    severity: 'minor'
                });
            });
        } else {
            report.categories.contrast.passed = 1;
            report.summary.passed++;
            report.passed.push({
                category: 'Color Contrast',
                message: 'All elements pass basic contrast checks'
            });
        }
    } catch (e) {
        console.error('Error checking color contrast:', e);
    }
    
    return report;
}

/**
 * Finds and reports on hidden content issues
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Object} Hidden content analysis
 */
function checkHiddenContent(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return null;
    
    const analysis = {
        hiddenElements: [],
        ariaHidden: [],
        visuallyHidden: [],
        issues: []
    };
    
    // Check for elements with display: none or visibility: hidden
    const allElements = root.querySelectorAll('*');
    allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const isHiddenByStyle = style.display === 'none' || style.visibility === 'hidden';
        
        if (isHiddenByStyle) {
            analysis.hiddenElements.push({
                element: el,
                reason: isHiddenByStyle ? 
                    (style.display === 'none' ? 'display: none' : 'visibility: hidden') : 
                    'other',
                text: el.textContent.trim().substring(0, 50) + '...'
            });
        }
        
        // Check for aria-hidden
        if (el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true') {
            analysis.ariaHidden.push({
                element: el,
                reason: el.textContent.trim().substring(0, 50) + '...'
            });
        }
        
        // Check for screen reader only classes (common patterns)
        const className = el.className.toString().toLowerCase();
        if (className.includes('sr-only') || 
            className.includes('screen-reader') || 
            className.includes('visually-hidden')) {
            analysis.visuallyHidden.push({
                element: el,
                reason: 'Visually hidden class',
                text: el.textContent.trim().substring(0, 50) + '...'
            });
        }
    });
    
    // Check if aria-hidden elements contain focusable elements
    analysis.ariaHidden.forEach(item => {
        const focusableInHidden = item.element.querySelectorAll('button, a, input, select, textarea, [tabindex]');
        if (focusableInHidden.length > 0) {
            analysis.issues.push({
                element: item.element,
                issue: 'Element with aria-hidden=true contains focusable elements',
                severity: 'critical'
            });
        }
    });
    
    return analysis;
}

/**
 * Checks for skip links and their implementation
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Object} Skip link analysis
 */
function checkSkipLinks(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return null;
    
    const analysis = {
        skipLinks: [],
        mainContentIds: [],
        issues: []
    };
    
    // Find skip links
    const skipLinks = root.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(link => {
        const href = link.getAttribute('href');
        const id = href.substring(1);
        const target = root.getElementById(id);
        
        analysis.skipLinks.push({
            element: link,
            targetId: id,
            target: target,
            text: link.textContent.trim()
        });
        
        if (!target) {
            analysis.issues.push({
                element: link,
                issue: `Skip link targets non-existent element with id "${id}"`,
                severity: 'critical'
            });
        }
    });
    
    // Find main content elements
    const mainElements = root.querySelectorAll('main, [role="main"], #main, #content, #content-wrapper');
    mainElements.forEach(el => {
        analysis.mainContentIds.push({
            element: el,
            id: el.id,
            tagName: el.tagName
        });
    });
    
    // Check if there are skip links
    if (analysis.skipLinks.length === 0 && analysis.mainContentIds.length > 0) {
        analysis.issues.push({
            element: null,
            issue: 'Page has main content but no skip links for keyboard users',
            severity: 'moderate'
        });
    }
    
    return analysis;
}

// TODO: Add any new functions or changes requested in the issue here

/**
 * Main accessibility fix function that consolidates all accessibility improvements
 * This function can be called after DOM is loaded to apply all accessibility fixes
 * @param {Object} options - Configuration options
 * @param {Document|HTMLElement} options.root - Root element to operate on
 * @param {boolean} options.autoApply - Whether to automatically apply fixes
 * @returns {Object} Summary of actions taken
 */
function applyAllAccessibilityFixes(options = {}) {
    const root = options.root || (typeof document !== 'undefined' ? document : null);
    const autoApply = options.autoApply !== false;
    const report = {
        applied: [],
        skipped: [],
        errors: []
    };
    
    if (!root) {
        report.errors.push('No valid root element provided');
        return report;
    }
    
    try {
        // 1. Apply lang attribute if missing
        const html = root.documentElement || (root.tagName === 'HTML' ? root : null);
        if (html && html.tagName === 'HTML' && !html.hasAttribute('lang')) {
            const langValue = getFullLangAttribute() || 'en';
            if (autoApply) {
                html.setAttribute('lang', langValue);
            }
            report.applied.push({
                fix: 'lang attribute',
                element: 'html',
                value: langValue
            });
        }
        
        // 2. Ensure unique landmark IDs
        const landmarks = ensureUniqueLandmarks(root);
        if (landmarks && landmarks.length > 0) {
            report.applied.push({
                fix: 'unique landmark IDs',
                count: landmarks.length
            });
        }
        
        // 3. Validate tables
        const tables = root.querySelectorAll('table');
        tables.forEach(table => {
            if (autoApply) {
                validateTableAccessibility(table);
                validateTableStructure(table);
            }
        });
        report.applied.push({
            fix: 'table validation',
            count: tables.length
        });
        
        // 4. Add accessible names to SVGs
        const svgs = root.querySelectorAll('svg');
        svgs.forEach(svg => {
            const name = getSvgAccessibleName(svg);
            if (name && autoApply) {
                setSvgAttributes(svg, name);
            }
        });
        report.applied.push({
            fix: 'svg accessible names',
            count: svgs.length
        });
        
        // 5. Handle fake links
        if (autoApply && typeof handleFakeLinks === 'function') {
            const handled = handleFakeLinks(root);
            report.applied.push({
                fix: 'fake links',
                count: typeof handled === 'number' ? handled : 'unknown'
            });
        }
        
        // 6. Add skip links if missing
        const hasSkipLinks = root.querySelector('a[href^="#"]');
        const hasMainContent = root.querySelector('main, [role="main"], #main, #content, #content-wrapper');
        if (hasMainContent && !hasSkipLinks && autoApply) {
            const skipLink = createAccessibleLink({
                href: '#main',
                text: 'Skip to main content',
                ariaLabel: 'Skip to main content'
            });
            if (skipLink) {
                root.body.insertBefore(skipLink, root.body.firstChild);
                report.applied.push({
                    fix: 'skip link',
                    text: 'Skip to main content'
                });
            }
        }
        
        return report;
        
    } catch (error) {
        report.errors.push({
            error: error.message,
            stack: error.stack
        });
        return report;
    }
}

/**
 * Helper function to debounce accessibility checks
 * @param {Function} func - Function to debounce
 * @param {number} wait - Debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounceAccessibilityCheck(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Main entry point for accessibility fixes
 * This function should be called after DOM is loaded
 */
function initializeAccessibility() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            mainAccessibilityInit();
        });
    } else {
        mainAccessibilityInit();
    }
}

/**
 * Internal initialization function
 */
function mainAccessibilityInit() {
    try {
        // Apply all accessibility fixes automatically
        const result = applyAllAccessibilityFixes({
            autoApply: true,
            root: document
        });
        
        console.log('Accessibility initialization completed:', result);
        
        // Run comprehensive audit
        const audit = generateAccessibilityAudit();
        console.log('Accessibility audit:', audit);
        
    } catch (error) {
        console.error('Error during accessibility initialization:', error);
    }
}

// Auto-initialize when script loads (if DOM is already loaded)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Use setTimeout to ensure DOM is fully parsed
    setTimeout(initializeAccessibility, 0);
}

// Export all new functions
export {
    checkFormLabels,
    validateHeadingHierarchy,
    checkColorContrast,
    generateAccessibilityAudit,
    checkHiddenContent,
    checkSkipLinks,
    applyAllAccessibilityFixes,
    debounceAccessibilityCheck,
    initializeAccessibility,
    mainAccessibilityInit
};