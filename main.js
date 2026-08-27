// main.js

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the lang attribute on the html element based on the page content
 * @param {string} langCode - The language code to set (e.g., 'en', 'es', 'fr')
 */
function setPageLanguage(langCode) {
    const htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement) {
        htmlElement.setAttribute('lang', langCode);
    }
}

/**
 * Detects the language from the page content and sets the lang attribute accordingly
 * @returns {string} The detected language code
 */
function detectAndSetLanguage() {
    const bodyText = document.body ? document.body.innerText || document.body.textContent || '' : '';
    
    // Simple language detection - English by default
    const language = bodyText.includes('hola') ? 'es' : 
                    bodyText.includes('bonjour') ? 'fr' : 
                    bodyText.includes('hallo') ? 'de' : 
                    'en';
    
    setPageLanguage(language);
    return language;
}

// Export functions if this is used in a module environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setPageLanguage, detectAndSetLanguage };
}

// Auto-set language when DOM is loaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', detectAndSetLanguage);
    } else {
        detectAndSetLanguage();
    }
}