// TODO: Add any new functions or changes requested in the issue here
function checkHeadingHierarchy() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  let isValid = true;

  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.substring(1));
    if (currentLevel - lastLevel > 1 && lastLevel !== 0) {
      console.warn(`Heading hierarchy issue at heading ${index + 1}: h${lastLevel} to h${currentLevel} skips a level`);
      isValid = false;
    }
    lastLevel = currentLevel;
  });

  return isValid;
}

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

function addressAccessibilityIssues() {
  // ... Existing code ...

  // TODO: This is the new function for the accessibility issue
  // Clear the existing dependency graph container (assuming it's an element with id 'dependencyGraph')
  const dependencyGraph = document.querySelector('#dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency graph for the application');
    }
  }

  // Call the function to check accessibility
  validateLinkAndButtonAccessibility();
}

// REACT_015: Get the lang attribute to be applied to the HTML element
function getLangAttribute() {
  // Attempt to determine the page's language from various sources
  const htmlElement = document.documentElement;

  // 1. Check the existing lang attribute on <html>
  let lang = htmlElement.getAttribute('lang');

  // 2. If not set, check the <meta> tag with http-equiv="content-language"
  if (!lang) {
    const metaContentLanguage = document.querySelector('meta[http-equiv="content-language"]');
    if (metaContentLanguage) {
      lang = metaContentLanguage.getAttribute('content');
    }
  }

  // 3. If still not set, check the <meta> tag for og:locale
  if (!lang) {
    const metaOgLocale = document.querySelector('meta[property="og:locale"]');
    if (metaOgLocale) {
      lang = metaOgLocale.getAttribute('content');
    }
  }

  // 4. Fallback to 'en' if no language is detected
  if (!lang) {
    lang = 'en';
  }

  // Normalize: take only the primary language subtag (e.g., "en-US" -> "en")
  if (lang.includes('-')) {
    lang = lang.split('-')[0];
  }

  return lang;
}

// Function added for issue: Identify and update specific functions that render dependency graphs or display module structure for debugging purposes.
function renderDependencyGraph(modules) {
  const graph = {};
  modules.forEach(module => {
    graph[module.name] = module.dependencies || [];
  });
  console.log('Dependency Graph:', JSON.stringify(graph, null, 2));
}

function displayModuleStructure(componentTree) {
  const structure = componentTree.map(component => ({
    name: component.name,
    type: component.type,
    children: component.children ? displayModuleStructure(component.children) : []
  }));
  console.log('Module Structure:', JSON.stringify(structure, null, 2));
}

// ... Existing code ...