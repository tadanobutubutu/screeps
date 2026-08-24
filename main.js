import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

// ... (existing code)

// Function to fetch heading levels from the HTML content
function getHeadingLevels(html) {
  const headingLevels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const headings = html.match(/<h[1-6][^>]*>/g);

  headings?.forEach(heading => {
    const headingLevel = parseInt(heading.slice(1));
    headingLevels[headingLevel]++;
  });

  return headingLevels;
}

// New function to address accessibility issues
function addressAccessibilityIssues() {
  // Combine content from both sources for accessibility checking
  let content = dependencyGraphContent + indexContent;

  // ... (existing code for REACT_015, REACT_017 & REACT_025, REACT_041, and REACT_036)

  // REACT_025: Enforce proper heading order (same heading level should not be repeated)
  if (!content) return;
  const headingLevels = getHeadingLevels(content);
  for (let level = 1; level <= 6; level++) {
    const headingCount = headingLevels[level];
    if (headingCount > 1) {
      throw new Error(`Multiple headings of level ${level} found in the HTML content. Headings should be unique within the same level.`);
    }
  }

  // REACT_033: Ensure main section contains a proper heading
  const mainTag = content.match(/<main\b[^>]*>/i)[0];
  const mainHeading = mainTag.match(/<h[1-6]>/i);
  if (!mainHeading) {
    throw new Error("The main section does not contain a proper heading.");
  }

  // REACT_035: Ensure landmarks are semantically valid and in proper sequence
  const landmarks = ['header', 'nav', 'main', 'footer'];
  if (!content.match(/<(header|nav|main|footer)>/i).every((tag, index) => tag === '<' + landmarks[index] + '>')) {
    throw new Error("Landmarks are not semantically valid or not in the proper sequence.");
  }

  // REACT_037: Check for missing ARIA labels on focusable elements
  let focusableCount = 0;
  const focusableElementRegex = /^(?:input|select|textarea|button|a)$/i;
  const focusableElements = content.matchAll(/(<[^>]+?)(@aria-labelledby|tabindex|autofocus)/gi);
  focusableElements.forEach(([element, attributeString]) => {
    if (focusableElementRegex.test(element.match(/<[^>]+>/i)[0].toLowerCase())) {
      focusableCount++;
    }
    const labelledByAttr = attributeString.match(/@aria-labelledby=["']([^"']+)["']/);
    if (labelledByAttr && labelledByAttr[1]) {
      const labelRegex = new RegExp(labelledByAttr[1], 'gi');
      if (!(content.match(labelRegex) || document.querySelectorAll(labelledByAttr[1]).length)) {
        throw new Error(`No element with id '${labelledByAttr[1]}' found to provide a label for the focusable element '${element}'.`);
      }
    }
  });
  if (focusableCount === 0) {
    throw new Error("No focusable elements found in the HTML content.");
  }

  // Re‑calculate summary values for consistency with original return shape
  const hasLang = /lang=/i.test(content);
  const mainCount = (content.match(/<main\b/gi) || []).length;
  const hasHeader = /<header\b/i.test(content);
  const hasNav = /<nav\b/i.test(content);
  const hasFooter = /<footer\b/i.test(content);
  const svgWithoutTitle = content.match(/<svg\b[^>]*>(?![^>]*\b(?:aria-label|title)\b)[^>]*>/gi) || [];
  const svgWithoutTitleCount = svgWithoutTitle.length;
  const svgCount = (content.match(/<svg\b[^>]*>/gi) || []).length;
  const fakeLinkPattern = /<a\s+(?!href\s*=\s*["'][^"#])[^>]*>/gi;
  const fakeLinks = content.match(fakeLinkPattern) || [];
  const fakeLinkCount = fakeLinks.length;

  return {
    hasLang,
    mainCount,
    hasHeader,
    hasNav,
    hasFooter,
    svgWithoutTitleCount,
    svgCount,
    fakeLinkCount,
    summary: `Accessibility Check: lang=${hasLang}, main=${mainCount}, header=${hasHeader}, nav=${hasNav}, footer=${hasFooter}, SVGs without accessible names=${svgWithoutTitleCount}, fake links=${fakeLinkCount}`
  };
}

// ... (existing code)