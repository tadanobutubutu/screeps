// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

import { exportData } from './utils/exporter.js';

/**
 * Main application entry point
 * Addresses accessibility requirements from insight report
 */
export function initializeApp() {
    const appContainer = document.getElementById('app');
    
    if (!appContainer) {
        console.error('App container not found');
        return;
    }

    // Ensure proper ARIA attributes for accessibility
    appContainer.setAttribute('role', 'application');
    appContainer.setAttribute('aria-label', 'Main application area');
    
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
        }
    });
    
    appContainer.prepend(skipLink);
    
    return appContainer;
}

/**
 * Export functionality with accessibility support
 * FIXED: Combined with accessibility improvements
 */
export function exportWithAccessibility(format = 'json') {
    const data = { app: 'main', status: 'accessible' };
    
    // Announce export action to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Exporting data as ${format}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
    
    return exportData(data, format);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeApp());
} else {
    initializeApp();
}

// Export for module usage
export default { initializeApp, exportWithAccessibility };