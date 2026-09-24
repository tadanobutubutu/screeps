// TODO: This is the existing code that needs to be preserved
// REACT_015: Add lang attribute to the <html> element
function someFunctionName(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/lang\s*=/i.test(attrs)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function someOtherFunctionName(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/(<table([^>]*)>)/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `<table${attrs}><caption>Table</caption>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/(<table([^>]*)>)([\s\S]*?)(<\/table>)/gi, (match, openTag, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        
        const thPattern = /<td>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = `<thead><tr>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</tr></thead>`;
        } else {
            // Add scope="col" to existing THs
            thead = firstRows.replace(/<th([^>]*)>/gi, (m, attrs) => {
                if (/scope\s*=/i.test(attrs)) return m;
                return `<th scope="col"${attrs}>`;
            });
            thead = `<thead>${thead}</thead>`;
        }
        
        if (!tbody) tbody = '';
        tbody = '<tbody>' + tbody + '</tbody>';

        return `<table${attrs}>${thead}${tbody}`;
    });

    // Add scope attribute to th elements if not present
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/\bscope=/i.test(match)) return match;
        return `<th${attrs} scope="col">`;
    });

    return html;
}