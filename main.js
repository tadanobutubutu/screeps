// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// Add your new functions and changes below this line.

function analyzeContentSafety(content) {
  // Analyze the content for safety issues and return a safety rating.
  // ... (Your implementation here)
}

function applyAccessibilityFixes(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/(<table[^>]*>)/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return match.replace(/(<table[^>]*>)/i, '$1<caption></caption>');
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        let firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        if (/<th[^>]*(?!scope)/i.test(firstRows)) {
            firstRows = firstRows.replace(/<th/gi, '<th scope="col"');
        }
        const thead = firstRows ? `<thead>${firstRows}</thead>` : '';
        const tbody = restRows ? `<tbody>${restRows}</tbody>` : '';

        return `<table${attrs}>${thead}${tbody}</table>`;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/scope=/i.test(attrs)) return match;
        return `<th${attrs} scope="col">`;
    });

    // ADD THE CODE THAT SETS THE ARIA ROLE FOR THE DEPENDENCYGRAPH CONTAINER
    const dependencyGraph = html.match(/<div[^>]*id=["']dependencyGraph["'][^>]*>/i);
    if (dependencyGraph) {
        const currentRole = dependencyGraph[0].match(/role=["']([^"']+)["']/i);
        if (!currentRole || currentRole[1] !== 'graph') {
            html = html.replace(/<div([^>]*id=["']dependencyGraph["'])([^>]*)>/i, '<div$1$2 role="graph">');
        }
    }

    return html;
}

/**
 * Divides two numbers with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} The result of the division
 * @throws {Error} If divisor is zero or if inputs are not valid numbers
 */
function divide(dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers');
  }

  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both arguments must be valid numbers');
  }

  if (divisor === 0) {
    throw new Error('Division by zero is not allowed');
  }

  return dividend / divisor;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;
    // KEEP OLD CODE HERE

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`<${role}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(new RegExp(`<${role}`, 'i'), `<div role="${role}"`);
            });
        }
    });
    // END OF OLD CODE
    
    return html;
}

// Main function that applies all accessibility fixes (modified to include the new ARIA role setting)
function fixAccessibility(html) {
    let result = html;
    result = analyzeContentSafety(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = applyAccessibilityFixes(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    return result;
}

// Helper function to fix table structure
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;
    
    // Ensure tables have proper structure
    html = html.replace(/(<table[^>]*>)/gi, (match, attrs) => {
        if (!/<caption/i.test(match)) {
            return match.replace(/(<table[^>]*>)/i, '$1<caption></caption>');
        }
        return match;
    });
    
    // Wrap rows in thead/tbody
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        
        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        
        let firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        
        if (/<th[^>]*(?!scope)/i.test(firstRows)) {
            firstRows = firstRows.replace(/<th/gi, '<th scope="col"');
        }
        
        const thead = firstRows ? `<thead>${firstRows}</thead>` : '';
        const tbody = restRows ? `<tbody>${restRows}</tbody>` : '';
        
        return `<table${attrs}>${thead}${tbody}</table>`;
    });
    
    // Add scope="col" to th elements without it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/scope=/i.test(attrs)) return match;
        return `<th${attrs} scope="col">`;
    });
    
    return html;
}

// Todo: Fix the test failures shown above

// TODO: add the new functions requested in the issue
// Function A: Check accessibility for adding a new book
function checkFunctionA(bookForm) {
  // Validates that the book form has proper accessibility attributes
  // Required for WCAG compliance when adding books
  if (!bookForm || typeof bookForm !== 'object') {
    return false;
  }
  
  // Check for required accessibility attributes
  const hasAccessibleLabel = bookForm.label || bookForm.title || bookForm.name;
  const hasRequiredAccessibility = bookForm.ariaLabel || hasAccessibleLabel;
  
  // Ensure form inputs have proper labels for screen readers
  if (bookForm.inputs) {
    const hasLabeledInputs = bookForm.inputs.every(input => 
      input.label || input.ariaLabel || input.id
    );
    return hasRequiredAccessibility && hasLabeledInputs;
  }
  
  return !!hasRequiredAccessibility;
}

// Function B: Validate book accessibility for screen readers
function checkFunctionB(bookData) {
  // Ensures book data is accessible for screen readers
  // Checks for proper descriptions and alternative text
  if (!bookData || typeof bookData !== 'object') {
    return false;
  }
  
  // Check for accessible book name/title
  const hasAccessibleName = bookData.name || bookData.title;
  
  // Check for description (accessibility requirement)
  const hasDescription = bookData.description || bookData.summary;
  
  // Check for cover image alt text if image exists
  let hasImageAlt = true;
  if (bookData.coverImage) {
    hasImageAlt = !!(bookData.coverImageAlt || bookData.alt);
  }
  
  return !!(hasAccessibleName && hasDescription && hasImageAlt);
}

// Save both functions as new exports
module.exports = {
    ...module.exports, // Preserve existing exports, including the upgraded analyzeContentSafety, divide, and existingFunction1
    analyzeContentSafety,
    divide,
    fixLandmarks,
    fixTableStructure,
    fixAccessibility,
    applyAccessibilityFixes, // Add the updated applyAccessibilityFixes with the ARIA role setting
    checkFunctionA, // Add the new function
    checkFunctionB // Add another new function
};