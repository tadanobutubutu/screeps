// main.js

// Preserving all existing code, exports, and functions from current main.js...

// Assuming that the existing code does not already have a function to update the HTML lang attribute
export function updateHtmlLangAttribute(lang) {
    const htmlTag = document.getElementsByTagName('html')[0];
    if (htmlTag) {
        htmlTag.setAttribute('lang', lang);
    }
}

// More code here...