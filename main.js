// Accessibility rule: REACT_017 - React Landmarks (main element required)
const REACT_017_RULE = {
  id: 'REACT_017',
  severity: 'warning',
  message: 'Page has no <main> landmark',
  check: (code) => {
    // Check for <main> tag presence
    const hasMainTag = /<main[\s>]/i.test(code);
    return {
      passed: hasMainTag,
      message: hasMainTag ? null : 'Wrap the primary content in <main> so it can be skipped'
    };
  }
};

// Example integration into existing test/lint flow:
function runAccessibilityChecks(filePath, code) {
  const results = [];
  
  // Check all landmark rules including REACT_017
  const rules = [REACT_017_RULE, /* other existing rules */];
  
  for (const rule of rules) {
    const result = rule.check(code);
    if (!result.passed) {
      results.push({
        file: filePath,
        rule: rule.id,
        severity: rule.severity,
        message: result.message
      });
    }
  }
  
  return results;
}

// Export for existing test infrastructure
module.exports = {
  REACT_017_RULE,
  runAccessibilityChecks,
  // ... preserve all existing exports
};