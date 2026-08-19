// =====  Existing code preserved (no exports removed or renamed)  =====
// ... all previous content of main.js ...

// =====  New exports added to satisfy REACT_015  =====

/**
 * Returns the root <html> language string used across the project.
 * @returns {string} Document language code (e.g. "en").
 */
export function getDocumentLang() {
    return 'en';
}

/**
 * Injects lang="en" into the <html> root element of an SSR/SSG HTML string.
 * This guarantees the React-rendered page satisfies the REACT_015 rule:
 *   "<html> has no lang attribute".
 *
 * @param {string} html - Full HTML document string to process.
 * @returns {string} HTML with lang attribute applied to the <html> tag.
 */
export function applyHtmlLang(html) {
    if (typeof html !== 'string') {
        throw new TypeError('applyHtmlLang expects a string argument');
    }

    // Regex explanation:
    //   (<html)            -> capture opening <html
    //   ([^>]*?)           -> non-greedy capture of any existing attributes
    //   (lang\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?  -> optional existing lang attr
    //   (>?)               -> closing >
    // We always force lang="en" while preserving other attributes.
    const lang = getDocumentLang();
    const langAttrPattern = new RegExp(
        `(<html)([^>]*?)((?:\\s+lang\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+))?\\s*>?)`,
        'i'
    );

    return html.replace(langAttrPattern, (match, p1, p2, p3) => {
        // Remove any pre-existing lang attribute from the attribute group
        let cleanedAttrs = p2.replace(/\s+lang\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
        // Ensure there's exactly one space before the lang attribute
        if (cleanedAttrs.length > 0 && !/\s$/.test(cleanedAttrs)) {
            cleanedAttrs += ' ';
        }
        return `${p1}${cleanedAttrs}lang="${lang}">`;
    });
}

// =====  End of new REACT_015 fixes  =====