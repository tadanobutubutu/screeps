function fixLintParsingErrors(code) {
  if (!code || typeof code !== 'string') {
    return code;
  }
  
  const lines = code.split('\n');
  
  // Fix lines that start with unexpected tokens (like bare "is")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // If line starts with unexpected token like "is" or other bare words
    if (/^(is|it|the|this|that|then|has|had|was|were|are|were)\s/.test(line)) {
      // Convert to comment to prevent parsing error
      lines[i] = '// ' + lines[i].trim();
    }
  }
  
  return lines.join('\n');
}

module.exports = { fixLintParsingErrors };