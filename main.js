// REACT_017: React Landmarks - Helper Functions
// Checks if HTML content has a <main> landmark for accessibility

/**
 * Checks if the given HTML content contains a <main> landmark
 * @param {string} htmlContent - The HTML content to check
 * @returns {boolean} - True if <main> landmark is present
 */
function hasMainLandmark(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return false;
  }
  // Match <main> tag with optional attributes
  const mainTagRegex = /<main(?:\s[^>]*)?\s*>/i;
  return mainTagRegex.test(htmlContent);
}

/**
 * Validates a list of HTML files for the <main> landmark requirement (REACT_017)
 * @param {Array<{path: string, content: string}>} files - Array of file objects with path and content
 * @returns {Object} - Object with passed and failed file arrays
 */
function checkMainLandmarks(files) {
  const results = {
    passed: [],
    failed: [],
    warnings: 2 // Number of occurrences from issue
  };

  if (!Array.isArray(files)) {
    return results;
  }

  files.forEach(file => {
    if (file && file.path && hasMainLandmark(file.content)) {
      results.passed.push(file.path);
    } else if (file && file.path) {
      results.failed.push(file.path);
    }
  });

  return results;
}

/**
 * Adds a <main> landmark wrapper around content if missing
 * @param {string} htmlContent - The HTML content to modify
 * @param {string} contentToWrap - The content to wrap in <main> tags
 * @returns {string} - Modified HTML content with <main> landmark
 */
function addMainLandmark(htmlContent, contentToWrap) {
  if (!htmlContent || !contentToWrap) {
    return htmlContent;
  }

  if (hasMainLandmark(htmlContent)) {
    return htmlContent; // Already has main landmark
  }

  // Insert main landmark after <body> or before closing </body>
  const bodyMatch = htmlContent.match(/<body(?:\s[^>]*)?>/i);
  if (bodyMatch) {
    const bodyTag = bodyMatch[0];
    const bodyIndex = htmlContent.indexOf(bodyTag) + bodyTag.length;
    return (
      htmlContent.slice(0, bodyIndex) +
      '\n    <main>' +
      contentToWrap +
      '</main>\n' +
      htmlContent.slice(bodyIndex)
    );
  }

  // Fallback: insert at the beginning if no body tag found
  return '<main>\n' + contentToWrap + '\n</main>\n' + htmlContent;
}

// REACT_025: Ensure unique landmarks
// Validates a list of HTML files for the unique landmark requirement (REACT_025)
function checkUniqueLandmarks(files) {
  if (!Array.isArray(files)) {
    return;
  }

  const htmlLandmarks = {
    header: [],
    banner: [],
    contentInfo: [],
    main: [],
    complimentary: [],
    contentRegion: [],
    footer: []
  };

  files.forEach(file => {
    if (!file || !file.content) {
      return;
    }

    const htmlContent = file.content;
    // Match landmarks with optional attributes
    const landmarksRegex = /<(?<landmark>\w+)[^>]*>/g;
    let match;

    while ((match = landmarksRegex.exec(htmlContent))) {
      const landmarkType = match[1].toLowerCase();
      htmlLandmarks[landmarkType].push(file.path);
    }
  });

  // Check for duplicate landmarks within files
  Object.entries(htmlLandmarks).forEach(([landmarkType, files]) => {
    if (files.length > 1) {
      // Duplicates exist within files for this landmark type
      console.error(
        `File count exceeds 1 for landmark type "${landmarkType}":`,
        files
      );
      return;
    }

    // Check for duplicate landmarks across files
    let unique = new Set();
    files.forEach(filePath => unique.add(filePath));
    if (files.length !== unique.size) {
      console.error(
        `Files count not contain unique ${landmarkType} landmarks:`
      );
      files.forEach(filePath => console.error(`  ${filePath}`));
    }
  });
}

// REACT_027: Fix 26 table structure issues
// Analyze the table structure and log issues if problems are found
function checkTableStructure(htmlContent) {
  // ... Add your logic here for checking and reporting table structure issues
}

// REACT_036: Fix 1 fake link issue
// Find and fix an example of a fake link issue in the given HTML
function fixFakeLink(htmlContent) {
  // ... Add your logic here for finding and fixing fake link issues
}

// REACT_041: Add accessible names to 2 SVGs
// Replace the 2 instances of the following SVG with accessible versions
// Using the provided helper function "setAccessibleSvg" defined elsewhere in the project
function makeSvgsAccessible(htmlContent) {
  const accessibleSvg1 = setAccessibleSvg(
    // ... Replace with your accessible SVG content for the first instance
  );
  const accessibleSvg2 = setAccessibleSvg(
    // ... Replace with your accessible SVG content for the second instance
  );

  return htmlContent
    .replace(
      /<svg.* id="svg1"[^>]*>.*<\/svg>/,
      accessibleSvg1
    )
    .replace(
      /<svg.* id="svg2"[^>]*>.*<\/svg>/,
      accessibleSvg2
    );
}

module.exports = {
  hasMainLandmark,
  checkMainLandmarks,
  addMainLandmark,
  checkUniqueLandmarks,
  checkTableStructure,
  fixFakeLink,
  makeSvgsAccessible
};