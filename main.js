// React Accessibility Rules

// REACT_015 - Critical: Add lang attribute to HTML element
function checkHtmlLangAttribute(ast) {
    const errors = [];
    const htmlElements = ast.children?.filter(
        child => child.type === 'JSXElement' && child.openingElement?.name?.name === 'html'
    );
    
    if (htmlElements.length === 0) {
        errors.push({
            rule: 'REACT_015',
            severity: 'critical',
            message: 'HTML element must have a lang attribute for screen readers',
            line: ast.loc?.start?.line || 1
        });
    }
    
    return errors;
}

// REACT_017 - Warning: Ensure proper landmark elements including <main>
function checkReactLandmarks(ast, filePath) {
    const errors = [];
    const htmlElements = ast.children?.filter(
        child => child.type === 'JSXElement' && child.openingElement?.name?.name === 'html'
    );
    
    if (htmlElements.length === 0) {
        // Check if there's a body element without a main wrapper
        const bodyElements = ast.children?.filter(
            child => child.type === 'JSXElement' && child.openingElement?.name?.name === 'body'
        );
        
        if (bodyElements.length > 0) {
            const body = bodyElements[0];
            const hasMainElement = body.children?.some(
                child => child.type === 'JSXElement' && child.openingElement?.name?.name === 'main'
            );
            
            if (!hasMainElement) {
                errors.push({
                    rule: 'REACT_017',
                    severity: 'warning',
                    message: 'Page has no <main> landmark',
                    file: filePath,
                    line: body.loc?.start?.line || 1
                });
            }
        }
    }
    
    return errors;
}

// REACT_027 - Fix table structures with proper semantic markup
function checkTableStructures(ast) {
    const errors = [];
    
    function visitNode(node, depth = 0) {
        if (node.type === 'JSXElement' && node.openingElement?.name?.name === 'table') {
            const hasCaption = node.children?.some(
                child => child.type === 'JSXElement' && child.openingElement?.name?.name === 'caption'
            );
            
            if (!hasCaption) {
                errors.push({
                    rule: 'REACT_027',
                    severity: 'warning',
                    message: 'Table should have a <caption> for accessibility',
                    line: node.loc?.start?.line || 1
                });
            }
            
            const headers = node.children?.filter(
                child => child.type === 'JSXElement' && child.openingElement?.name?.name === 'th'
            );
            
            if (headers && headers.length > 0) {
                headers.forEach(th => {
                    const hasScope = th.openingElement?.attributes?.some(
                        attr => attr.name?.name === 'scope'
                    );
                    
                    if (!hasScope) {
                        errors.push({
                            rule: 'REACT_027',
                            severity: 'warning',
                            message: '<th> elements should have a scope attribute',
                            line: th.loc?.start?.line || 1
                        });
                    }
                });
            }
        }
        
        if (node.children) {
            node.children.forEach(child => visitNode(child, depth + 1));
        }
    }
    
    visitNode(ast);
    return errors;
}

// REACT_041 - Add accessible names to SVG elements
function checkSvgAccessibility(ast) {
    const errors = [];
    
    function visitNode(node) {
        if (node.type === 'JSXElement' && node.openingElement?.name?.name === 'svg') {
            const hasAriaLabel = node.openingElement?.attributes?.some(
                attr => attr.name?.name === 'aria-label' || attr.name?.name === 'aria-labelledby'
            );
            
            const hasTitle = node.children?.some(
                child => child.type === 'JSXElement' && child.openingElement?.name?.name === 'title'
            );
            
            const hasRole = node.openingElement?.attributes?.some(
                attr => attr.name?.name === 'role' && attr.value?.value === 'img'
            );
            
            if (!hasAriaLabel && !hasTitle && !hasRole) {
                errors.push({
                    rule: 'REACT_041',
                    severity: 'warning',
                    message: 'SVG elements should have an accessible name via aria-label, aria-labelledby, <title>, or role="img"',
                    line: node.loc?.start?.line || 1
                });
            }
        }
        
        if (node.children) {
            node.children.forEach(child => visitNode(child));
        }
    }
    
    visitNode(ast);
    return errors;
}

// REACT_025 - Ensure unique landmarks (no duplicate main/nav elements)
function checkUniqueLandmarks(ast) {
    const errors = [];
    const landmarkCounts = {
        main: 0,
        nav: 0,
        header: 0,
        footer: 0,
        aside: 0
    };
    
    function visitNode(node) {
        if (node.type === 'JSXElement') {
            const tagName = node.openingElement?.name?.name?.toLowerCase();
            
            if (landmarkCounts.hasOwnProperty(tagName)) {
                landmarkCounts[tagName]++;
                
                if (tagName === 'main' && landmarkCounts[tagName] > 1) {
                    errors.push({
                        rule: 'REACT_025',
                        severity: 'warning',
                        message: 'Page should have only one <main> landmark',
                        line: node.loc?.start?.line || 1
                    });
                }
                
                if (tagName === 'nav' && landmarkCounts[tagName] > 1) {
                    errors.push({
                        rule: 'REACT_025',
                        severity: 'info',
                        message: 'Multiple <nav> elements should have unique aria-label attributes',
                        line: node.loc?.start?.line || 1
                    });
                }
            }
        }
        
        if (node.children) {
            node.children.forEach(child => visitNode(child));
        }
    }
    
    visitNode(ast);
    return errors;
}

// REACT_036 - Fix fake links (divs pretending to be links)
function checkFakeLinks(ast) {
    const errors = [];
    
    function visitNode(node) {
        if (node.type === 'JSXElement') {
            const tagName = node.openingElement?.name?.name;
            const attributes = node.openingElement?.attributes || [];
            
            const isClickable = attributes.some(
                attr => attr.name?.name === 'onClick'
            );
            
            const hasOnKeyDown = attributes.some(
                attr => attr.name?.name === 'onKeyDown'
            );
            
            const hasRole = attributes.find(
                attr => attr.name?.name === 'role'
            );
            
            const className = attributes.find(
                attr => attr.name?.name === 'className'
            );
            
            // Check for divs/spans that should be links or buttons
            if (tagName === 'div' || tagName === 'span') {
                const hasLinkClass = className?.value?.value?.match(/link|clickable|nav/i);
                
                if (isClickable && !hasRole && !['button', 'a', 'input'].includes(tagName)) {
                    errors.push({
                        rule: 'REACT_036',
                        severity: 'warning',
                        message: `${tagName} with onClick should either be a <button> or have role="button"`,
                        line: node.loc?.start?.line || 1
                    });
                }
                
                if (hasLinkClass && !hasRole && !['a', 'button'].includes(tagName)) {
                    errors.push({
                        rule: 'REACT_036',
                        severity: 'warning',
                        message: `Element with link-related className should be an <a> or <button>`,
                        line: node.loc?.start?.line || 1
                    });
                }
            }
            
            // Check for links without href
            if (tagName === 'a' && isClickable) {
                const hasHref = attributes.some(
                    attr => attr.name?.name === 'href'
                );
                
                if (!hasHref) {
                    errors.push({
                        rule: 'REACT_036',
                        severity: 'warning',
                        message: '<a> element with onClick should have an href attribute or be a <button>',
                        line: node.loc?.start?.line || 1
                    });
                }
            }
        }
        
        if (node.children) {
            node.children.forEach(child => visitNode(child));
        }
    }
    
    visitNode(ast);
    return errors;
}

// Main analysis function
function analyzeAccessibility(ast, filePath) {
    const allErrors = [];
    
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        allErrors.push(...checkHtmlLangAttribute(ast));
        allErrors.push(...checkReactLandmarks(ast, filePath));
        allErrors.push(...checkTableStructures(ast));
        allErrors.push(...checkSvgAccessibility(ast));
        allErrors.push(...checkUniqueLandmarks(ast));
        allErrors.push(...checkFakeLinks(ast));
    }
    
    return allErrors;
}

module.exports = {
    checkHtmlLangAttribute,
    checkReactLandmarks,
    checkTableStructures,
    checkSvgAccessibility,
    checkUniqueLandmarks,
    checkFakeLinks,
    analyzeAccessibility
};