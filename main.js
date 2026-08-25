/**
 * Main entry point for the accessibility checker
 */

// Export all rules
export const rules = {
  REACT_017: {
    name: 'React Landmarks',
    check: (html) => {
      const hasMain = /<main[\s>]/.test(html);
      return {
        passed: hasMain,
        message: hasMain ? null : 'Page has no <main> landmark'
      };
    }
  }
};

// Check function for HTML content
export function checkAccessibility(html) {
  const results = [];
  
  for (const [ruleId, rule] of Object.entries(rules)) {
    const result = rule.check(html);
    results.push({
      rule: ruleId,
      ...result
    });
  }
  
  return results;
}

// Legacy support
module.exports = { rules, checkAccessibility };