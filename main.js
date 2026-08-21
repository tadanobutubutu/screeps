// ... (existing code)

/**
 * Adds `lang="en"` to the root `<html>` element if it is missing.
 * Preserves any existing attributes and avoids duplicating a `lang` attribute.
 * @param {string} content - HTML string to modify
 * @returns {string} - Modified HTML with a language attribute
 */
function addLangAttribute(content) {
  return content.replace(/<html(\s+[^>]*)?>/gi, (match, attrs) => {
    if (attrs && /\slang\s*=/i.test(attrs)) {
      return match;
    }
    return `<html${attrs ? attrs : ''} lang="en">`;
  });
}

/**
 * Adds a <main> landmark to the HTML content for accessibility
 */
async function addMainLandmark() {
    try {
        console.log('Adding <main> landmark to HTML content for accessibility...');
        const filesToUpdate = [path.join('docs', 'index.html')];
        for (const filePath of filesToUpdate) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const updatedContent = fileContent.replace(/<\/main>/gi, '');
            const newFileContent = updatedContent.replace(/(<body[^>]*>)([\s\S]*)(<\/html>)/gi, (match, bodyOpen, bodyContent, bodyClose) => {
                return bodyOpen + '\n<main>\n' + bodyContent + '\n</main>' + bodyClose;
            });
            fs.writeFileSync(filePath, newFileContent);
            console.log(`Main landmark added to ${filePath}`);
        }
        console.log('All HTML files have been updated with <main> landmarks.');
    } catch (error) {
        console.error('Error adding <main> landmark:', error);
        throw error;
    }
}

/**
 * Adds a function to modify the HTML content with the `lang` attribute.
 * This can be used to handle more complex scenarios, such as multiple languages in one file.
 */
async function modifyHtmlWithLangAttribute(content) {
    // Implementation would go here
}

/**
 * Replaces hash links with buttons for better accessibility
 */
async function replaceHashLinksWithButtons() {
    try {
        console.log('Replacing hash links with buttons for better accessibility...');
        const filePath = path.join('docs', 'index.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = fileContent.replace(/<a(\s+[^>]*)?href\s*=\s*["']#([^"']*)["'](\s+[^>]*)?>([^<]*)<\/a>/gi, (match, attrsBefore, id, attrsAfter, text) => {
            const idMatch = id;
            const idAttr = idMatch ? ` id="${idMatch}"` : '';
            const allAttrs = (attrsBefore || '') + (attrsAfter || '');
            const classMatch = allAttrs.match(/class\s*=\s*["']([^"']*)["']/i);
            const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
            // Remove the href from the button to avoid "fake link" issues
            return `<button${idAttr}${classAttr} type="button">${text}</button>`;
        });
        fs.writeFileSync(filePath, updatedContent);
        console.log('Hash links replaced with buttons successfully.');
    } catch (error) {
        console.error('Error replacing hash links with buttons:', error);
        throw error;
    }
}

/**
 * Adds accessible names to SVG files for better screen reader support
 */
async function addAccessibleNamesToSvgFiles() {
    try {
        const svgFiles = fs.readdirSync('docs').filter(file => 
            file.endsWith('.svg')
        );
        
        for (const fileName of svgFiles) {
            const filePath = path.join('docs', fileName);
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Check if SVG already has role="img" or aria-label
            const hasRoleImg = fileContent.includes('role="img"');
            const hasAriaLabel = fileContent.includes('aria-label');

            if (!hasRoleImg && !hasAriaLabel) {
                // Add role="img" and aria-label if missing
                const modifiedContent = fileContent.replace(
                    /<svg([^>]*)>/gi,
                    (match, attrs) => {
                        const newAttrs = [...(attrs || []), 'role="img"', 'aria-label="Generated dependency graph"'];
                        return `${match}[${newAttrs.join(' ')}]`;
                    }
                ).replace(
                    /<svg([^>]*)>/gi,
                    (match, attrs) => {
                        const newAttrs = [...(attrs || []), 'role="img"', 'aria-label="Generated dependency graph"'];
                        return `${match}[${newAttrs.join(' ')}]`;
                    }
                );

                fs.writeFileSync(filePath, modifiedContent);
                console.log(`Added accessible names to ${fileName}`);
            }
        }
    } catch (error) {
        console.error('Error adding accessible names to SVGs:', error);
        throw error;
    }
}

// ... (existing code)