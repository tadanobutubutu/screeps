// ==UserScript==
// @name         Accessibility Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Address accessibility issues from insight report
// @author       You
// @match        <all_urls>
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Ensure the document has a language attribute for screen readers
    if (document.documentElement && !document.documentElement.lang) {
        document.documentElement.lang = 'en';
    }

    // Add skip-to-content link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '0';
    skipLink.style.backgroundColor = '#fff';
    skipLink.style.padding = '8px';
    skipLink.style.zIndex = '1000';

    skipLink.addEventListener('focus', function () {
        this.style.top = '0';
    });

    skipLink.addEventListener('blur', function () {
        this.style.top = '-40px';
    });

    // Insert the skip link at the top of the body
    if (document.body) {
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // TODO: Address accessibility issues from insight report
    // ----- END ORIGINAL CODE -----
})();