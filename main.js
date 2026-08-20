// main.js - Helper utilities for accessibility fixes

function hasMainLandmark(content) {
  const mainRegex = /<main[\s>]/gi;
  return mainRegex.test(content);
}

function addMainLandmark(content, childrenTag = 'children') {
  // Pattern to find <body>{children}</body> or <div>{children}</div>
  const bodyPattern = /<(\w+)>\s*\{(\w+)\}\s*<\/\1>/g;
  
  return content.replace(bodyPattern, (match, tag, children) => {
    if (tag === 'body' || tag === 'div' || tag === 'section') {
      return `<${tag}>\n    <main>\n        {${children}}\n    </main>\n</${tag}>`;
    }
    return match;
  });
}

function escapeHtml(str) {
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
}

// New function for rotating back
function rotateBack() {
  // Implementation of the rotate back functionality
  // This function should replace the anchor tag with a button for better accessibility
  // Placeholder implementation: currently a stub
}

// Export utilities for testing and new button component
export { hasMainLandmark, addMainLandmark, escapeHtml };
export function rotateBackButton() {
  return '<button id="unrotate" onclick="rotateBack()">rotate back</button>';
}