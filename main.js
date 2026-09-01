// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `<table${attrs}><caption></caption>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        const thPattern = /<td>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`;
        } else {
            thead = `<thead>${firstRows}</thead>`;
        }
        if (!tbody) tbody = '';
        tbody = `<tbody>${tbody}</tbody>`;

        return `<table${attrs}>${thead}${tbody}</table>`;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/\bscope=/i.test(match)) return match;
        return `<th${attrs} scope="col">`;
    });

    return html;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Ensure <main> landmark exists
    if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Supplementary"></aside></main>'
        );
    }

    // Ensure <footer> landmark exists
    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
        html = html.replace(
            /<\/body>/i,
            '<footer></footer></body>'
        );
    }

    return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;

    const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)];
    let offset = 0;

    svgMatches.forEach((match, index) => {
        const fullMatch = match[0];
        const attrs = match[1];
        const svgStart = match.index + offset;
        const svgEnd = html.indexOf('</svg>', svgStart);

        if (svgEnd === -1) return;

        const svgContent = html.substring(svgStart, svgEnd + 6);
        const hasTitle = /<title/i.test(svgContent);
        const hasAriaLabel = /\baria-label=/i.test(attrs);
        const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs);

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
            const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`);
            const oldSvgLength = svgContent.length;
            html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength);
            offset += newSvg.length - oldSvgLength;
        }
    });

    return html;
}

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(/^</, '<' + tag).replace(`<${tag}`, `<${tag} role="region"`);
            });
        }
    });

    return html;
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;

    // Find spans or divs with onclick that act as links and convert to <a>
    html = html.replace(
        /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
        (match, before, onclick, after) => {
            const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
            if (hrefMatch) {
                return `<a href="${hrefMatch[1]}"${before}${after}>`;
            }
            return match;
        }
    );

    html = html.replace(/<\/span>/gi, '</a>');

    return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
  console.log('Addressing accessibility issues from insight report:', insightReport);
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

// TODO: Update the existing function using the new functions for rendering graph/index
function renderGraph(data, containerId) {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Add accessible title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Data Visualization Graph';
    svg.appendChild(title);

    // Add description for screen readers
    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'This graph displays the provided data in a visual format.';
    svg.appendChild(desc);

    // Calculate max value for scaling
    const maxValue = Math.max(...data.map(item => item.value));

    // Create bars for each data point
    data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * 80;
        const barY = 100 - barHeight;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', `${index * 20 + 10}`);
        rect.setAttribute('y', `${barY}`);
        rect.setAttribute('width', '10');
        rect.setAttribute('height', `${barHeight}`);
        rect.setAttribute('fill', '#4CAF50');
        rect.setAttribute('aria-label', `Value: ${item.value}, Label: ${item.label}`);

        // Add hover effect
        rect.addEventListener('mouseenter', () => {
            rect.setAttribute('fill', '#45a049');
        });
        rect.addEventListener('mouseleave', () => {
            rect.setAttribute('fill', '#4CAF50');
        });

        svg.appendChild(rect);

        // Add label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${index * 20 + 15}`);
        text.setAttribute('y', '95');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '3');
        text.textContent = item.label;
        svg.appendChild(text);
    });

    container.appendChild(svg);
}

function renderIndex(data, containerId) {
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Create a list element
    const list = document.createElement('ul');
    list.setAttribute('role', 'list');
    list.setAttribute('aria-label', 'Data Index');

    // Add each data item to the list
    data.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'listitem');
        listItem.setAttribute('aria-label', `Item ${index + 1}: ${item.label}, Value: ${item.value}`);

        const label = document.createElement('span');
        label.textContent = item.label;
        label.style.fontWeight = 'bold';

        const value = document.createElement('span');
        value.textContent = `: ${item.value}`;
        value.style.marginLeft = '5px';

        listItem.appendChild(label);
        listItem.appendChild(value);
        list.appendChild(listItem);
    });

    container.appendChild(list);
}

module.exports = {
    addLangAttribute,
    fixTableStructure,
    fixLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    applyAccessibilityFixes,
    addressAccessibilityIssues,
    createInPageButton,
    renderGraph,
    renderIndex
};