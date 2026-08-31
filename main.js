// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

/**
 * Function to generate a unique landmark identifier
 * Addresses REACT_025: Ensure unique landmarks
 * @param {string} baseName - The base name for the landmark
 * @param {number} index - The index number for uniqueness
 * @returns {string} Unique landmark identifier
 */
function generateUniqueLandmarkId(baseName, index) {
    return `${baseName}-${index}`;
}

/**
 * Function to check and fix landmark roles
 * Addresses REACT_017: Add landmark roles and fix landmark issues
 * @param {Object} element - The element to check
 * @param {string} role - The landmark role to apply
 * @returns {Object} Element with proper landmark role
 */
function applyLandmarkRole(element, role) {
    if (!element.props || !element.props.role) {
        return {
            ...element,
            props: {
                ...element.props,
                role: role
            }
        };
    }
    return element;
}

/**
 * Function to add accessible name to an SVG element
 * Addresses REACT_041: Add accessible names to 2 SVGs
 * @param {Object} svgElement - The SVG element
 * @param {string} description - The accessible description
 * @returns {Object} SVG element with aria-label
 */
function addSvgAccessibleName(svgElement, description) {
    return {
        ...svgElement,
        props: {
            ...svgElement.props,
            'aria-label': description,
            role: 'img'
        }
    };
}

/**
 * Function to fix fake link issues
 * Addresses REACT_036: Fix 1 fake link issue
 * @param {Object} element - The potentially fake link element
 * @returns {Object} Fixed element with appropriate role or element type
 */
function fixFakeLink(element) {
    if (element.type === 'a' && !element.props.href) {
        return {
            ...element,
            type: 'button',
            props: {
                ...element.props,
                role: 'button',
                onClick: element.props.onClick || (() => {})
            }
        };
    }
    return element;
}

// Example component structure demonstrating accessibility fixes
const AccessibilityDemo = () => {
    return {
        type: 'div',
        props: {
            className: 'app-container',
            lang: 'en' // REACT_015: Add lang attribute to HTML element
        },
        children: [
            {
                type: 'header',
                props: {
                    role: 'banner' // REACT_017: Add landmark roles
                },
                children: [
                    addSvgAccessibleName(
                        { type: 'svg', props: { className: 'logo' } },
                        'Company Logo'
                    ),
                    {
                        type: 'nav',
                        props: { role: 'navigation' }, // REACT_017: Add landmark roles
                        children: [
                            {
                                type: 'a',
                                props: { href: '/home', children: 'Home' }
                            },
                            {
                                type: 'a',
                                props: { href: '/about', children: 'About' }
                            }
                        ]
                    }
                ]
            },
            {
                type: 'main',
                props: {
                    role: 'main', // REACT_017: Add landmark roles
                    id: generateUniqueLandmarkId('main', 1) // REACT_025: Ensure unique landmarks
                },
                children: [
                    {
                        type: 'section',
                        props: {
                            role: 'region',
                            'aria-label': 'Product Information', // REACT_017: Add landmark roles
                            id: generateUniqueLandmarkId('region', 1) // REACT_025: Ensure unique landmarks
                        },
                        children: [
                            addSvgAccessibleName(
                                { type: 'svg', props: { className: 'icon' } },
                                'Decorative icon'
                            ),
                            {
                                type: 'table',
                                props: {},
                                children: [
                                    {
                                        type: 'thead',
                                        props: {},
                                        children: [
                                            {
                                                type: 'tr',
                                                props: {},
                                                children: [
                                                    { type: 'th', props: { scope: 'col' }, children: 'Name' }, // REACT_027: Already implemented
                                                    { type: 'th', props: { scope: 'col' }, children: 'Value' }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            fixFakeLink({
                                type: 'a',
                                props: {
                                    children: 'Click here',
                                    onClick: () => {}
                                }
                            }) // REACT_036: Fix 1 fake link issue
                        ]
                    }
                ]
            },
            {
                type: 'footer',
                props: {
                    role: 'contentinfo' // REACT_017: Add landmark roles
                },
                children: [
                    {
                        type: 'a',
                        props: { href: '/privacy', children: 'Privacy Policy' }
                    }
                ]
            }
        ]
    };
};

module.exports = {
    generateUniqueLandmarkId,
    applyLandmarkRole,
    addSvgAccessibleName,
    fixFakeLink,
    AccessibilityDemo
};