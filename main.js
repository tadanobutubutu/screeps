// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation

// Standalone function to get the accessible name of an SVG element
// Uses aria-labelledby first, then falls back to the <title> child element
function getSvgAccessibleName(svg) {
  if (!svg || !(svg instanceof SVGElement) || svg.tagName !== 'svg') {
    return '';
  }

  // First, check for aria-labelledby reference
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const names = ids
      .map(id => {
        const el = document.getElementById(id);
        return el ? el.textContent.trim() : '';
      })
      .filter(text => text.length > 0);
    if (names.length > 0) {
      return names.join(' ');
    }
  }

  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return ariaLabel.trim();
  }

  // Fall back to <title> child element
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  // Check for title attribute on the SVG itself
  const titleAttr = svg.getAttribute('title');
  if (titleAttr && titleAttr.trim().length > 0) {
    return titleAttr.trim();
  }

  return '';
}

function main() {
  return 'Hello World';
}

// New function added by HEAD branch
function newFunction() {
    // TODO: Implement functionality
}

// TODO: Implement this function for adding SVG accessibility props
function addSvgAccessibilityProps(svgElement, options = {}) {
  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    focusable = false,
    tabIndex
  } = options;

  if (role && !svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', role);
  }
}

// isLinkAccessible: Checks if a link element is accessible according to accessibility standards
// Returns true if the link has a valid href, is not disabled, and has meaningful content
function isLinkAccessible(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  // Must have a valid href attribute with non-empty value
  const href = link.getAttribute('href');
  if (!href || href.trim() === '') {
    return false;
  }

  // Should not be disabled (either via disabled attribute or aria-disabled)
  if (link.hasAttribute('disabled') || link.getAttribute('aria-disabled') === 'true') {
    return false;
  }

  // Link should have some text content (non-empty)
  if (!link.textContent.trim()) {
    return false;
  }

  return true;
}

// Ensure the root HTML element has a lang attribute
function ensureHtmlLangAttribute() {
  if (!document.documentElement) return;
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

// Ensure a given element has a non-empty id; auto-generate one if missing
function ensureElementHasId(element, prefix = 'el') {
  if (!element) return '';
  if (element.id && element.id.trim().length > 0) {
    return element.id;
  }
  const generatedId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  element.id = generatedId;
  return generatedId;
}

// Add an aria-label to an element if it is missing or empty
function ensureAriaLabel(element, label) {
  if (!element) return;
  const existing = element.getAttribute('aria-label');
  if (!existing || existing.trim().length === 0) {
    element.setAttribute('aria-label', label || 'Interactive element');
  }
}

// Render a textual representation of a dependency graph for assistive technologies
function renderDependencyGraphDescription(graph) {
  if (!graph || !graph.nodes || !graph.edges) {
    return '';
  }
  const nodeLabels = graph.nodes.map(n => n.label || n.id).join(', ');
  const edgeDescriptions = graph.edges.map(e => {
    const from = graph.nodes.find(n => n.id === e.from);
    const to = graph.nodes.find(n => n.id === e.to);
    const fromLabel = from ? (from.label || from.id) : e.from;
    const toLabel = to ? (to.label || to.id) : e.to;
    return `${fromLabel} depends on ${toLabel}`;
  });
  return `Dependency graph with ${graph.nodes.length} nodes (${nodeLabels}). ${edgeDescriptions.join('. ')}.`;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.addFocusVisibilityStyles();
    this.setupFocusVisiblePolyfill();
    this.enhanceDynamicContent();
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[aria-hidden="false"]');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('.dropdown, .dropdown-menu');
    dropdownCont