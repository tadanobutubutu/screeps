// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (NEW FUNCTION)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addAccessibleNamesToSvgFiles)
// - REACT_025: Ensure unique landmarks (NEW FUNCTION)
// - REACT_036: Fix 1 fake link issue (DONE: replaceHashLinksWithButtons)

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
            // Check if <main> landmark already exists to avoid duplicates (REACT_025)
            if (fileContent.includes('<main')) {
                console.log(`Main landmark already exists in ${filePath}, skipping`);
                continue;
            }
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
 * Fixes table structure issues by ensuring tables have proper structure
 * with required elements like <thead>, <tbody>, and proper headers
 */
async function fixTableStructureIssues() {
    try {
        console.log('Fixing table structure issues...');
        const filePath = path.join('docs', 'index.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Fix tables by ensuring they have proper header rows and structure
        const updatedContent = fileContent.replace(
            /<table([^>]*)>([\s\S]*?)<\/table>/gi,
            (match, tableAttrs, tableContent) => {
                // Check if table already has proper structure
                if (tableContent.includes('<thead') || tableContent.includes('<th')) {
                    return match;
                }
                
                // Add thead with header row for tables without proper headers
                const firstRowMatch = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
                if (firstRowMatch) {
                    // Convert first row cells to header cells
                    let fixedContent = tableContent.replace(
                        /<tr[^>]*>([\s\S]*?)<\/tr>/i,
                        (rowMatch, rowContent) => {
                            const headerCells = rowContent.replace(
                                /<td[^>]*>([\s\S]*?)<\/td>/gi,
                                (cellMatch, cellContent) => {
                                    return `<th scope="col">${cellContent}</th>`;
                                }
                            );
                            return `<thead><tr${rowContent.match(/<tr[^>]*>/) ? ' ' + rowContent.match(/<tr[^>]*>/)[0].substring(4) : ''}>${headerCells}</tr></thead>`;
                        }
                    );
                    
                    // Wrap remaining content in tbody if not already present
                    if (!fixedContent.includes('<tbody')) {
                        const afterHeader = fixedContent.replace(
                            /<thead>[\s\S]*?<\/thead>/i,
                            ''
                        );
                        fixedContent = fixedContent.replace(
                            /<\/thead>([\s\S]*)/i,
                            '</thead><tbody>$1</tbody>'
                        );
                    }
                    
                    return `<table${tableAttrs}><thead>${fixedContent.match(/<thead[^>]*>[\s\S]*?<\/thead>/i) ? '' : ''}</thead><tbody>${fixedContent.match(/<tbody/) ? '' : ''}${fixedContent.replace(/<thead[\s\S]*?<\/thead>/i, '').replace(/<tbody[\s\S]*?<\/tbody>/i, '')}</tbody></table>`;
                }
                
                // For simple tables without rows, just wrap content
                if (!tableContent.includes('<tr')) {
                    return `<table${tableAttrs}><tbody><tr><td>${tableContent}</td></tr></tbody></table>`;
                }
                
                // Default fix: wrap content in tbody
                return `<table${tableAttrs}><tbody>${tableContent}</tbody></table>`;
            }
        );
        
        fs.writeFileSync(filePath, updatedContent);
        console.log('Table structure issues fixed.');
    } catch (error) {
        console.error('Error fixing table structure issues:', error);
        throw error;
    }
}

/**
 * Ensures unique landmarks in the HTML content
 * Addresses REACT_025: Ensure unique landmarks
 */
async function ensureUniqueLandmarks() {
    try {
        console.log('Ensuring unique landmarks in HTML content...');
        const filePath = path.join('docs', 'index.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Track landmark usage to ensure uniqueness
        const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
        let updatedContent = fileContent;
        
        landmarkRoles.forEach((role, index) => {
            const landmarks = updatedContent.match(new RegExp(`<[^>]*role=["']${role}["'][^>]*>`, 'gi'));
            if (landmarks && landmarks.length > 1) {
                // Add aria-label to make duplicate landmarks unique
                updatedContent = updatedContent.replace(
                    new RegExp(`(<[^>]*role=["']${role}["'][^>]*?)>`, 'gi'),
                    (match, attrs) => {
                        // Check if aria-label already exists
                        if (attrs.includes('aria-label')) {
                            return match;
                        }
                        // Add unique aria-label
                        return `${attrs} aria-label="${role}-${index}-unique">`;
                    }
                );
            }
        });
        
        // Fix multiple main landmarks by converting extras to divs
        const mainMatches = updatedContent.match(/<main[^>]*>/gi);
        if (mainMatches && mainMatches.length > 1) {
            // Keep first main, convert others to div with role="main" fallback
            let mainCount = 0;
            updatedContent = updatedContent.replace(
                /<main([^>]*)>/gi,
                (match, attrs) => {
                    mainCount++;
                    if (mainCount === 1) {
                        return match;
                    }
                    return `<div${attrs.replace(/^(?=\s)(?!\s)/, '')}>`;
                }
            );
            
            // Also replace closing tags
            let closeCount = 0;
            updatedContent = updatedContent.replace(
                /<\/main>/gi,
                () => {
                    closeCount++;
                    if (closeCount === 1) {
                        return '</main>';
                    }
                    return '</div>';
                }
            );
        }
        
        fs.writeFileSync(filePath, updatedContent);
        console.log('Unique landmarks ensured.');
    } catch (error) {
        console.error('Error ensuring unique landmarks:', error);
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
                        const attributeString = attrs || '';
                        return `<svg${attributeString} role="img" aria-label="Generated dependency graph">`;
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