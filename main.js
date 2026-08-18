const primaryContent = document.getElementById('primary-content');
if (primaryContent) {
    const mainElement = document.createElement('main');
    // Add ARIA landmark role for better screen reader support
    mainElement.setAttribute('role', 'main');
    // Add lang attribute if not already present
    if (!document.documentElement.hasAttribute('lang')) {
        document.documentElement.setAttribute('lang', 'en');
    }
    mainElement.appendChild(primaryContent);
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
}

// This function should be called in a suitable place in the application lifecycle,
// such as during the initialization of the app or after the DOM is fully loaded.

// Call the function to wrap the primary content with <main>
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const primaryContent = document.getElementById('primary-content');
        if (primaryContent) {
            const mainElement = document.createElement('main');
            // Add ARIA landmark role for better screen reader support
            mainElement.setAttribute('role', 'main');
            // Add lang attribute if not already present
            if (!document.documentElement.hasAttribute('lang')) {
                document.documentElement.setAttribute('lang', 'en');
            }
            mainElement.appendChild(primaryContent);
            primaryContent.parentNode.replaceChild(mainElement, primaryContent);
        }
    });
} else {
    const primaryContent = document.getElementById('primary-content');
    if (primaryContent) {
        const mainElement = document.createElement('main');
        // Add ARIA landmark role for better screen reader support
        mainElement.setAttribute('role', 'main');
        // Add lang attribute if not already present
        if (!document.documentElement.hasAttribute('lang')) {
            document.documentElement.setAttribute('lang', 'en');
        }
        mainElement.appendChild(primaryContent);
        primaryContent.parentNode.replaceChild(mainElement, primaryContent);
    }
}