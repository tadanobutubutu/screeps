// main.js - React application entry point with main landmark
import React from 'react';
import { createRoot } from 'react-dom/client';
import MainContent from './components/MainContent';

/**
 * Main application entry point
 */

function initializeApp() {
    const mainElement = document.querySelector('main') || document.getElementById('main');
    if (mainElement) {
        console.log('Main landmark found');
    }
    
    // Set ARIA role for accessibility
    mainElement.setAttribute('role', 'main');
    
    // Fix React Language Attribute accessibility warning
    document.documentElement.setAttribute('lang', 'en');
    
    return mainElement;
}

function getMainContent() {
    return document.querySelector('main') || document.getElementById('main');
}

function init() {
    const main = getMainContent();
    if (main) {
        main.setAttribute('role', 'main');
    }
    // The issue requires adding lang="en" attribute to the <html> element to fix React Language Attribute accessibility warnings (REACT_015).
    document.documentElement.setAttribute('lang', 'en');
    return main;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        getMainContent,
        init
    };
}

// ESM export for modern environments
export { initializeApp, getMainContent, init };