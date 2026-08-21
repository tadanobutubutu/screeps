module.exports = {
    accessibilityFixes: true,
    ensureHTMLLangAttribute: () => {
        const htmlElement = document.querySelector('html');
        htmlElement.setAttribute('lang', 'en');
    }
};