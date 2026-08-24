import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

function getHeadingLevels(html) {
  const headingLevels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const headings = html.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach(heading => {
    const headingLevel = parseInt(heading.tagName.charAt(1), 10);
    headingLevels[headingLevel]++;
  });

  return headingLevels;
}

function addLandmarkRoles(container) {
  // Add landmark roles to main content if not already present
  const main = container.querySelector('main, [role="main"]');
  const nav = container.querySelector('nav, [role="navigation"]');
  const header = container.querySelector('header, [role="banner"]');
  const footer = container.querySelector('footer, [role="contentinfo"]');
  const aside = container.querySelector('aside, [role="complementary"]');

  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
  if (aside && !aside.getAttribute('role')) {
    aside.setAttribute('role', 'complementary');
  }
}

function addSvgAccessibleNames(container) {
  // Add accessible names to SVGs
  const svgs = container.querySelectorAll('svg');

  svgs.forEach(svg => {
    // Skip if already has an accessible name
    if (svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby')) {
      return;
    }

    // Try to use title element as accessible name
    const title = svg.querySelector('title');
    if (title && title.textContent.trim()) {
      svg.setAttribute('aria-label', title.textContent.trim());
    }
  });
}

function ensureUniqueLandmarks(container) {
  // Check for and fix duplicate landmark roles
  const landmarks = findLandmarks(container);
  const uniqueLandmarks = [...new Set(landmarks)];

  if (uniqueLandmarks.length !== landmarks.length) {
    throw new Error('Non-unique landmarks found in the HTML');
  }
}

function fixFakeLinkIssues(container) {
  // Find and fix fake link issues (anchors without href that look like links)
  const fakeLinks = container.querySelectorAll('a:not([href]), a[href=""]');

  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function addThScope(container) {
  // Add scope attribute to <th> elements
  const thElements = container.querySelectorAll('th');

  thElements.forEach(th => {
    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

function findLandmarks(container) {
  // Find landmark roles in the provided HTML
  const landmarks = container.querySelectorAll('[role][role~="landmark"], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]');

  return Array.from(landmarks).map(landmark => landmark.getAttribute('role'));
}

function countUniqueLandmarks(container) {
  // Count the unique landmark roles in the provided HTML
  const landmarks = container.querySelectorAll('[role][role~="landmark"], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]');

  return new Set(Array.from(landmarks).map(landmark => landmark.getAttribute('role'))).size;
}

function addressIssuesFromInsightReport() {
  let content = dependencyGraphContent + indexContent;

  // Create a temporary container to manipulate the HTML
  const container = document.createElement('div');
  container.innerHTML = content;

  // Add landmark roles
  addLandmarkRoles(container);

  // Add accessible names to SVGs
  addSvgAccessibleNames(container);

  // Ensure unique landmarks
  ensureUniqueLandmarks(container);

  // Fix fake link issues
  fixFakeLinkIssues(container);

  // Add scope attribute to <th> elements
  addThScope(container);

  // Add the lang attribute to the content
  const htmlElement = document.createElement('html');
  htmlElement.setAttribute('lang', 'en');
  htmlElement.innerHTML = container.innerHTML;

  const results = {
    content: htmlElement.outerHTML,
    headingLevels: getHeadingLevels(container),
    uniqueLandmarkCount: countUniqueLandmarks(container)
  };

  return results;
}

function addressAccessibilityIssues() {
  return addressIssuesFromInsightReport();
}

// Exports remain unchanged
export { getHeadingLevels, addressIssuesFromInsightReport };