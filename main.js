const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

// TODO: Implement renderIndexView functionality
// Placeholder for now, replace with actual implementation
function renderIndexView(containerId) {
  const container = document.getElementById(containerId) || document.body;
  
  // Clear existing content
  container.innerHTML = '';
  
  // Create main landmark region
  const mainRegion = document.createElement('main');
  mainRegion.id = 'main-content';
  mainRegion.setAttribute('role', 'main');
  
  // Create header with skip link target
  const header = document.createElement('header');
  header.id = 'header';
  
  // Create heading
  const heading = document.createElement('h1');
  heading.textContent = 'Welcome';
  heading.id = 'main-heading';
  header.appendChild(heading);
  
  // Create navigation
  const nav = document.createElement('nav');
  nav.id = 'navigation';
  nav.setAttribute('aria-label', 'Main navigation');
  
  // Create navigation list
  const navList = document.createElement('ul');
  const navItems = [
    { text: 'Home', href: '#' },
    { text: 'About', href: '#about' },
    { text: 'Contact', href: '#contact' }
  ];
  
  navItems.forEach((item) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.text;
    listItem.appendChild(link);
    navList.appendChild(listItem);
  });
  
  nav.appendChild(navList);
  
  // Create article content
  const article = document.createElement('article');
  article.id = 'main-article';
  article.setAttribute('aria-labelledby', 'main-heading');
  
  const intro = document.createElement('p');
  intro.textContent = 'This is the index view with proper accessibility landmarks.';
  article.appendChild(intro);
  
  // Create footer
  const footer = document.createElement('footer');
  footer.id = 'footer';
  const footerText = document.createElement('p');
  footerText.textContent = '© 2024';
  footer.appendChild(footerText);
  
  // Assemble the view
  mainRegion.appendChild(header);
  mainRegion.appendChild(nav);
  mainRegion.appendChild(article);
  mainRegion.appendChild(footer);
  container.appendChild(mainRegion);
  
  // Update live region for screen reader announcement
  if (typeof a11yStore !== 'undefined' && a11yStore.updateLiveRegion) {
    a11yStore.updateLiveRegion('Index view loaded', 'polite');
  }
  
  return mainRegion;
}

// Create a new button element
function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  return button;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  // New property to count dependencies
  countDependencies,

  init() {
    this.createLiveRegion();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.fixFakeLinks();
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
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
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
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

    const targetId = skipLink.getAttribute('href');
    const target = targetId ? document.querySelector(targetId.substring(1)) : null;

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
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  // Check landmark elements
  checkLandmarkElements() {
    const landmarkElements = LANDMARK_ELEMENTS;
    landmarkElements.forEach((element) => {
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
  addSvgAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      // Ensure SVG has a title for accessible name
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image'; // Default accessible name
        svg.insertBefore(titleElement, svg.firstChild);
      }
      
      // Ensure title has an ID for aria-labelledby
      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }
      
      // Set aria-labelledby to point to the title
      svg.setAttribute('aria-labelledby', titleElement.id);
      
      // Add role img if not present (redundant but safe)
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  // Fix fake links (REACT_036)
  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[data-href]');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-disabled', 'true');
    });
  },
};

// Count dependencies using Document and regex
function countDependencies(document) {
  const importCommentRegExp = /import\s+.*?from\s+['"].*?['"]/g;
  const importCount = (document.body.textContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// New function to handle adding landmark regions
function addLandmarkRegions() {
  LANDMARK_ELEMENTS.forEach((tag) => {
    const element = document.querySelector(tag);
    if (element) {
      if (!element.id) {
        element.id = `${tag}-region`;
      }
    }
  });
}

// Run game logic here...

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach((issue) => {
    // Handle each issue type
    switch (issue.type) {
      case 'missing-lang':
        if (!document.documentElement.lang) {
          document.documentElement.lang = 'en';
        }
        break;
      case 'missing-skip-link':
        if (!document.querySelector('.skip-link')) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          document.body.prepend(skipLink);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach((img) => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
    }
  });
}