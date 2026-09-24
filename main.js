// Main entry point for the application

/**
 * Generates the HTML content with proper landmark elements
 * @param {Object} options - Configuration options
 * @returns {string} Generated HTML string
 */
function generatePageContent(options = {}) {
    const { title = 'Quality & Metrics Reports', content = '' } = options;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <header>
        <nav>...</nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>...</footer>
</body>
</html>
    `.trim();
}

/**
 * Wraps content in a main landmark element
 * @param {string} content - The content to wrap
 * @returns {string} Content wrapped in main tags
 */
function wrapInMainLandmark(content) {
    return `<main>\n        ${content}\n    </main>`;
}

/**
 * Updates HTML files to include proper landmark elements
 * @param {string} htmlContent - The HTML content to update
 * @returns {string} Updated HTML content with main landmark
 */
function updateHTMLWithLandmarks(htmlContent) {
    // Check if main landmark already exists
    if (htmlContent.includes('<main') && htmlContent.includes('</main>')) {
        return htmlContent;
    }
    
    // Find body content and wrap it in main
    const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        const bodyContent = bodyMatch[1];
        const wrappedContent = wrapInMainLandmark(bodyContent);
        return htmlContent.replace(
            /<body>[\s\S]*?<\/body>/i,
            `<body>\n        ${wrappedContent}\n    </body>`
        );
    }
    
    return htmlContent;
}

const affectedFunctions = {};

// TODO: This is the existing code that needs to be preserved

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
  // Create a new button element
  const button = document.createElement('button');

  // Set the button's ID, text content, and class
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;

  // Append the button to the body or a specific container
  document.body.appendChild(button);

  // Return the created button for further manipulation if needed
  return button;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  // Existing code

  // New property to count dependencies
  countDependencies: 0,

  init() {
    // Existing init code
    this.createLiveRegion();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.fixFakeLinks(); // Added for REACT_036
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.padding = '0';
    this.liveRegion.style.margin = '-1px';
    this.liveRegion.style.overflow = 'hidden';
    this.liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    this.liveRegion.style.whiteSpace = 'nowrap';
    this.liveRegion.style.border = '0';
    document.body.appendChild(this.liveRegion);

    // Update scope attributes in all .html files in the views directory
    const viewsDir = path.join(__dirname, 'views');
    fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = updateThScopeAttribute(content);
        fs.writeFileSync(filePath, updatedContent);
      });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    dropdownContainers.forEach(container => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        // Ensure focus trapping only within the dropdown container
        if (focusIsInsideContainer) {
          // Find the first focusable element within the container
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    // Trap focus within modals
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('.modal[aria-hidden="false"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  // Setup skip links
  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.indexOf('Safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.announce(message, priority);
  },

  // Check landmark elements
  checkLandmarkElements() {
    const landmarkElements = LANDMARK_ELEMENTS;
    landmarkElements.forEach(element => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        // Ensure landmark has a unique ID
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }

        // Ensure unique accessible names for duplicate landmarks
        if (landmarks.length > 1) {
          if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  // Add SVG accessibility props
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      // Ensure SVG has a title for accessible name
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image'; // Default accessible name
        svg.insertBefore