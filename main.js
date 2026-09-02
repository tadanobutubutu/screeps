// TODO: This is the existing code that needs to be preserved
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f80b1b788bad4952d8d93f08d3c7d22a06ff80d3_
// <!-- todo-ash: b498b47abee4b3f29c69a97a22637d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-ash: 1f8b632535b07b809ac49f5e1c81cf389f9c1 -->

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/gi, (match, attrs) => {
        if (/lang\s*=/i.test(attrs)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<caption/gi.test(content)) return match;
        return `<table${attrs}><caption></caption>${content}</table>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/gi.test(content)) return match;
        
        // Close caption if it's open
        content = content.replace(/<caption([^>]*)>([\s\S]*?)(?=<(thead|tbody|tr|$))/gi, 
            (captionMatch, captionAttrs, captionContent) => {
                if (!captionContent.includes('</caption>')) {
                    return `<caption${captionAttrs}>${captionContent}</caption>`;
                }
                return captionMatch;
            }
        );

        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;

        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');

        const thPattern = /<th[^>]*>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            // Convert first row tds to ths with scope="col"
            const convertedFirstRow = firstRows.replace(/<td([^>]*)>/gi, (tdMatch, tdAttrs) => {
                return `<th${tdAttrs} scope="col">`;
            }).replace(/<\/td>/gi, '</th>');
            thead = `<thead><tr>${convertedFirstRow.match(/<th[^>]*>[\s\S]*?<\/th>/gi).join('')}</tr></thead>`;
        } else {
            // Add scope="col" to existing ths
            const convertedFirstRow = firstRows.replace(/<th([^>]*)>([\s\S]*?)<\/th>/gi, (thMatch, thAttrs, thContent) => {
                if (/scope\s*=/i.test(thAttrs)) return thMatch;
                return `<th${thAttrs} scope="col">${thContent}</th>`;
            });
            thead = `<thead>${convertedFirstRow}</thead>`;
        }
        if (!tbody) tbody = '';
        tbody = `<tbody>${tbody}</tbody>`;

        return `<table${attrs}>${thead}${tbody}</table>`;
    });

    return html;
}

// Export functions for use elsewhere
module.exports = {
    addLangAttribute,
    fixTableStructure
};

// Support ES modules export if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = module.exports;
}

// Additional existing functionality preserved below
function processHTML(html, options = {}) {
    const { lang = 'en', fixTables = true } = options;
    
    if (fixTables) {
        html = fixTableStructure(html);
    }
    
    html = addLangAttribute(html, lang);
    
    return html;
}

// Example usage preserved
// const processed = processHTML(someHTMLString, { lang: 'en', fixTables: true });