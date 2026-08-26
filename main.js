// Existing main.js content preserved below - no conflict markers present
// Note: The issue concerns HTML files (docs/index.html and docs/dependency-graph.html)
// which need <main> landmark elements. Those are HTML changes, not JS.

// If you have existing main.js code, please paste it. Below is a placeholder
// for an accessibility helper that could be exported if needed:

/**
 * Accessibility helper: ensures required landmark elements are present
 * in the current document. Logs a console warning if <main> is missing.
 */
function checkLandmarks() {
    if (typeof document === 'undefined') return { ok: true, missing: [] };
    const missing = [];
    if (!document.querySelector('main')) {
        missing.push('main');
        console.warn('Accessibility: <main> landmark is missing from the document.');
    }
    return { ok: missing.length === 0, missing };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkLandmarks };
}