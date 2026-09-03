// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// Add your new functions and changes below this line.

function analyzeContentSafety(content) {
  // Analyze the content for safety issues and return a safety rating.
  // ... (Your implementation here)
  if (typeof content !== 'string') {
    return { safe: false, issues: ['Content must be a string'] };
  }
  
  const unsafePatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i
  ];
  
  const issues = [];
  unsafePatterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push('Potentially unsafe content detected');
    }
  });
  
  return {
    safe: issues.length === 0,
    issues: issues
  };
}

function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/(<table([^>]*)>)/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return '<table' + attrs + '><caption></caption>';
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/(<table([^>]*)>(?:(?!<\/table>).)*)(<\/table>)/gi, (match, opening, attrs, closing) => {
        if (/<thead/i.test(opening)) return match;
        const rows = opening.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        let firstRows = rows.slice(0, 1).join('');
        let restRows = rows.slice(1).join('\n');
        if (!/<th/i.test(firstRows) && firstRows) {
            firstRows = firstRows.replace(/<td/gi, '<th').replace(/<\/td>/gi, '</th>');
        }
        const thead = firstRows ? '<thead><tr>' + firstRows.replace(/<\/?tr>/gi, '') + '</tr></thead>' : '';
        const tbody = restRows ? '<tbody><tr>' + restRows.replace(/<\/?tr>/gi, '') + '</tr></tbody>' : '';

        return '<table' + attrs + '>' + thead + tbody + closing;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/scope\s*=/i.test(attrs)) return match;
        return '<th' + attrs + ' scope="col">';
    });

    // ADD THE CODE THAT SETS THE ARIA ROLE FOR THE DEPENDENCYGRAPH CONTAINER
    const dependencyGraph = html.match(/<div[^>]*id\s*=\s*["']dependency-graph["'][^>]*>/gi);
    if (dependencyGraph) {
        const currentRole = html.match(/id\s*=\s*["']dependency-graph["'][^>]*role\s*=\s*["']([^"']*)["']/i);
        if (!currentRole || currentRole[1] !== 'graph') {
            html = html.replace(/(<div[^>]*id\s*=\s*["']dependency-graph["'])/gi, '$1 role="graph"');
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
        const pattern = new RegExp('<' + role + '[^>]*>', 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(new RegExp('role\\s*=\\s*["\']' + role + '["\']', 'i'), '');
            });
        }
    });
    // END OF OLD CODE
}

// Main function that applies all accessibility fixes (modified to include the new ARIA role setting)
function applyAccessibilityFixes(html) {
    let result = html;
    result = analyzeContentSafety(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = result;
    result = result;
    result = result;
    return result;
}

// Todo: Fix the test failures shown above

// TODO: add the new functions requested in the issue
// Function A implementation
function checkFunctionA(arg1, arg2) {
  // Implement your logic here
  if (typeof arg1 !== 'string' || typeof arg2 !== 'string') {
    return false;
  }
  return arg1.length > 0 && arg2.length > 0;
}

// Function B implementation
function checkFunctionB(arg1, arg2) {
  // Implement your logic here
  if (typeof arg1 !== 'number' || typeof arg2 !== 'number') {
    return false;
  }
  return arg1 > 0 && arg2 > 0;
}

// Save both functions as new exports
module.exports = {
    ...module.exports, // Preserve existing exports, including the upgraded analyzeContentSafety, divide, and existingFunction1
    analyzeContentSafety,
    divide,
    fixTableStructure,
    fixLandmarks,
    applyAccessibilityFixes, // Add the updated applyAccessibilityFixes with the ARIA role setting
    checkFunctionA, // Add the new function
    checkFunctionB // Add another new function
};