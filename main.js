const {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');

// Export affected functions and Main component to make them accessible
module.exports = {
  ...affectedFunctions,
  Main: Main,
  a11yStore: {
    init() {
      // original code
      this.createLiveRegion();
      this.setupKeyboardNavigation();
      this.setupFocusManagement();
      this.setupSkipLinks();
      this.checkLandmarkElements();
      this.addSVGAccessibilityProps();
      this.fixFakeLinks();
      this.initAccessibility();
    },

    createAccessibleButton,
    createAccessibleDialog,
    announceToScreenReader,
    trapFocus,
    initAccessibility,
    createLiveRegion,
    checkLandmarkElements,
    addSVGAccessibilityProps,
    fixFakeLinks,
  },
};

const a11yStore = module.exports.a11yStore;

function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');

  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  return 'SVG graphic';
}

function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    switch(issue.id) {
      case "REACT_015":
        document.documentElement.lang = document.documentElement.lang || "en";
        break;
      case "REACT_017":
        // Add landmark roles and fix landmark issues ...
        break;
      case "REACT_041":
        // Add accessible names to the relevant SVG elements ...
        break;
      case "REACT_025":
        // Ensure unique landmarks ...
        break;
      case "REACT_036":
        // Fix fake link issue - use proper anchor element ...
        break;
      default:
        // Handle other accessibility issues ...
    }
  });
}

const mainElement = document.createElement('main');
mainElement.setAttribute('lang', document.documentElement.lang);

export default function Main() {
  return (
    <>
      {/* REACT_015: Lang attribute should be set at HTML document level */}
      {/* This is typically set in index.html or via document.documentElement.lang */}

      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>

      <main role="main" aria-label="Main content area">
        <h1>Welcome to our site</h1>

        {/* REACT_041: Add accessible names to SVGs */}
        <svg
          role="img"
          aria-label="Settings icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" />
        </svg>

        {/* REACT_041: Add accessible names to second SVG */}
        <svg
          role="img"
          aria-label="User profile icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
        </svg>

        {/* REACT_036: Fix fake link issue - use proper anchor element */}
        <a href="/dashboard" className="button-link">
          Go to Dashboard
        </a>

        {/* REACT_017 & REACT_025: Ensure unique landmarks */}
        {/* Using proper landmark elements ensures unique landmarks */}
      </main>
    </>
  );
}