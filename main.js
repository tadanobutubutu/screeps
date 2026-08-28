// Content Script for Translation Extension

(function() {
    'use strict';

    // Configuration
    const config = {
        defaultLang: 'en',
        buttonPosition: 'fixed',
        buttonBottom: '20px',
        buttonRight: '20px'
    };

    // State
    let currentLang = config.defaultLang;
    let inPageButton = null;

    /**
     * Gets the language attribute value for the HTML element
     * @returns {string} The language code (e.g., 'en', 'es', 'fr')
     */
    function getLangAttribute() {
        // Try to get lang from document.documentElement first
        const htmlLang = document.documentElement.getAttribute('lang');
        if (htmlLang && htmlLang.trim() !== '') {
            return htmlLang.trim();
        }

        // Fallback: try to detect from browser or meta tags
        const metaLang = document.querySelector('meta[http-equiv="content-language"]');
        if (metaLang) {
            const content = metaLang.getAttribute('content');
            if (content) {
                return content.split(',')[0].trim();
            }
        }

        // Default to browser language if available
        if (navigator.language) {
            return navigator.language.split('-')[0];
        }

        return config.defaultLang;
    }

    /**
     * Creates and inserts the in-page translation button
     */
    function createInPageButton() {
        // Remove existing button if present
        if (inPageButton) {
            inPageButton.remove();
        }

        // Get the lang attribute for the HTML element
        const langAttr = getLangAttribute();

        // Create the button element
        inPageButton = document.createElement('button');
        inPageButton.id = 'translation-ext-button';
        inPageButton.innerHTML = '🌐';
        inPageButton.title = `Current language: ${langAttr.toUpperCase()}`;
        
        // Apply styles
        inPageButton.style.cssText = `
            position: ${config.buttonPosition};
            bottom: ${config.buttonBottom};
            right: ${config.buttonRight};
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background-color: #4A90D9;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 2147483647;
        `;

        // Add click event
        inPageButton.addEventListener('click', function() {
            handleButtonClick();
        });

        // Add hover effects
        inPageButton.addEventListener('mouseenter', function() {
            inPageButton.style.transform = 'scale(1.1)';
        });

        inPageButton.addEventListener('mouseleave', function() {
            inPageButton.style.transform = 'scale(1)';
        });

        // Insert the button into the page
        document.body.appendChild(inPageButton);

        // Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
        document.documentElement.setAttribute('lang', langAttr);

        return inPageButton;
    }

    /**
     * Handles button click events
     */
    function handleButtonClick() {
        console.log('Translation button clicked');
        // Translation logic would go here
    }

    /**
     * Initializes the content script
     */
    function init() {
        // Set current language from attribute
        currentLang = getLangAttribute();
        
        // Create the in-page button
        createInPageButton();

        console.log('Translation extension initialized with lang:', currentLang);
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for testing (if needed)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            getLangAttribute,
            createInPageButton,
            handleButtonClick,
            init
        };
    }
})();