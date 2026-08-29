// main.js - Application entry point

import insightApi from './insightApi';

// Navigation landmark region
const Navigation = {
    init() {
        if (typeof document !== 'undefined') {
            this.element = document.querySelector('nav');
            if (this.element) {
                this.element.setAttribute('role', 'navigation');
                this.element.setAttribute('aria-label', 'Main navigation');
            }
        }
    }
};

// Main content landmark region
const MainContent = {
    init() {
        if (typeof document !== 'undefined') {
            this.element = document.querySelector('main');
            if (this.element) {
                this.element.setAttribute('role', 'main');
                this.element.setAttribute('aria-label', 'Main content');
            }
        }
    }
};

// Complementary landmark region (sidebars, etc.)
const Complementary = {
    init() {
        if (typeof document !== 'undefined') {
            const asides = document.querySelectorAll('aside');
            asides.forEach((aside, index) => {
                aside.setAttribute('role', 'complementary');
                aside.setAttribute('aria-label', `Supplementary content ${index + 1}`);
            });
        }
    }
};

// ContentInfo landmark region (footer)
const Footer = {
    init() {
        if (typeof document !== 'undefined') {
            const footer = document.querySelector('footer');
            if (footer) {
                footer.setAttribute('role', 'contentinfo');
                footer.setAttribute('aria-label', 'Site footer');
            }
        }
    }
};

// Banner landmark region (header)
const Banner = {
    init() {
        if (typeof document !== 'undefined') {
            const header = document.querySelector('header');
            if (header) {
                header.setAttribute('role', 'banner');
                header.setAttribute('aria-label', 'Site header');
            }
        }
    }
};

// Search landmark region
const Search = {
    init() {
        if (typeof document !== 'undefined') {
            const searchForms = document.querySelectorAll('form[role="search"]');
            searchForms.forEach(form => {
                form.setAttribute('role', 'search');
                form.setAttribute('aria-label', 'Search');
            });
        }
    }
};

// Add proper landmark regions
// Landmark regions provide accessible navigation for assistive technologies
function addProperLandmarkRegions() {
    Navigation.init();
    MainContent.init();
    Complementary.init();
    Footer.init();
    Banner.init();
    Search.init();
    
    console.log('Landmark regions initialized');
}

// Initialize landmark regions when DOM is ready (browser only)
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addProperLandmarkRegions);
    } else {
        addProperLandmarkRegions();
    }
}

// Initialize the application
function initApp() {
    console.log('Application initialized');
}

// Existing exports (preserved)
export function getValue() {
  return 42;
}

export function processItem(item) {
  return item * 2;
}

// Missing exports to add
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item, 0);
}
export function formatString(text) {
  return text.toUpperCase();
}
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// TODO: Implement function for addressing accessibility issues from insight report
export const addressAccessibilityIssues = (insightReport) => {
  const recommendations = [];
  
  if (!insightReport || !insightReport.accessibility || !insightReport.accessibility.issues) {
    return recommendations;
  }

  const issues = insightReport.accessibility.issues;
  
  issues.forEach((issue) => {
    switch (issue.severity) {
      case 'critical':
        recommendations.push(`[CRITICAL] ${issue.id}: ${issue.description}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'high':
        recommendations.push(`[HIGH] ${issue.id}: ${issue.description}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'medium':
        recommendations.push(`[MEDIUM] ${issue.id}: ${issue.description}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'low':
        recommendations.push(`[LOW] ${issue.id}: ${issue.description}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      default:
        recommendations.push(`[UNKNOWN] ${issue.id}: ${issue.description}`);
    }
  });

  return recommendations;
};

export const generateInsightReport = async (options) => {
  try {
    const report = await insightApi.getReport(options);
    return report;
  } catch (error) {
    console.error('Error generating insight report:', error);
    throw error;
  }
};

// Export landmark functionality for testing
export {
    initApp,
    addProperLandmarkRegions,
    Navigation,
    MainContent,
    Complementary,
    Footer,
    Banner,
    Search
};

// Initialize the app
initApp();