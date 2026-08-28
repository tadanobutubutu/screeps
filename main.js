// main.js - Main module for accessibility checking

// TODO: Implement this function for checking link and button accessibility
function checkLinkAndButtonAccessibility(document) {
    const issues = [];
    
    // Check all links
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
        const hasText = link.textContent.trim().length > 0;
        const hasAriaLabel = link.hasAttribute('aria-label') && link.getAttribute('aria-label').trim().length > 0;
        const hasAriaLabelledBy = link.hasAttribute('aria-labelledby') && link.getAttribute('aria-labelledby').trim().length > 0;
        const hasTitle = link.hasAttribute('title') && link.getAttribute('title').trim().length > 0;
        
        // Check for image with alt text inside the link
        const imgWithAlt = link.querySelector('img[alt]');
        const hasImgAlt = imgWithAlt && imgWithAlt.getAttribute('alt').trim().length > 0;
        
        if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasImgAlt) {
            issues.push({
                type: 'link',
                index,
                tag: 'a',
                href: link.getAttribute('href'),
                message: 'Link is missing accessible text. Provide text content, aria-label, aria-labelledby, title, or img[alt].'
            });
        }
    });
    
    // Check all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
        const hasText = button.textContent.trim().length > 0;
        const hasAriaLabel = button.hasAttribute('aria-label') && button.getAttribute('aria-label').trim().length > 0;
        const hasAriaLabelledBy = button.hasAttribute('aria-labelledby') && button.getAttribute('aria-labelledby').trim().length > 0;
        const hasTitle = button.hasAttribute('title') && button.getAttribute('title').trim().length > 0;
        
        // Check for input with value inside the button
        const inputWithValue = button.querySelector('input[type="submit"], input[type="button"]');
        const hasInputValue = inputWithValue && inputWithValue.value && inputWithValue.value.trim().length > 0;
        
        if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasInputValue) {
            issues.push({
                type: 'button',
                index,
                tag: 'button',
                className: button.className,
                message: 'Button is missing accessible text. Provide text content, aria-label, aria-labelledby, title, or input value.'
            });
        }
    });
    
    return issues;
}

// Export for use in other modules
module.exports = {
    checkLinkAndButtonAccessibility
};