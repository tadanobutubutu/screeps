// TODO: Add back any required exports that might have been removed
// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// Function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

// Function to validate landmark structure for accessibility issues
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(landmark);
        if (!element) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// TODO: Implement harvest logic
function harvest() {
    // This function should collect resources or data from available sources
    // Add your implementation here
}

// Wrap primary content in a <main> element for accessibility and semantic HTML
function wrapPrimaryContentInMain() {
    // Find the primary content element using common selectors
    const contentSelectors = [
        '[role="main"]',
        '#main-content',
        '.main-content',
        '#content',
        '.content',
        'article',
        '[role="article"]'
    ];

    let primaryContent = null;

    // Try to find existing primary content
    for (const selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            primaryContent = element;
            break;
        }
    }

    // If no primary content found, look for the largest content area
    if (!primaryContent) {
        const allContent = document.querySelectorAll('div, section');
        let maxSize = 0;
        
        allContent.forEach(el => {
            const rect = el.getBoundingClientRect();
            const size = rect.width * rect.height;
            if (size > maxSize && el.textContent.trim().length > 100) {
                maxSize = size;
                primaryContent = el;
            }
        });
    }

    if (!primaryContent) {
        console.warn('No primary content found to wrap');
        return false;
    }

    // Check if already wrapped in a <main> element
    const existingMain = primaryContent.closest('main');
    if (existingMain) {
        console.log('Primary content is already wrapped in a <main> element');
        return true;
    }

    // Create a new <main> element
    const mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');

    // Insert the <main> element before the primary content
    const parent = primaryContent.parentNode;
    if (parent) {
        parent.insertBefore(mainElement, primaryContent);
        mainElement.appendChild(primaryContent);
        
        console.log('Successfully wrapped primary content in <main> element');
        return true;
    }

    return false;
}

// Preserve any existing exports here
export { createInPageButton, validateLandmarkStructure, harvest, wrapPrimaryContentInMain };