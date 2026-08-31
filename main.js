module.exports = {
  createInPageButton: function(buttonText, onClickHandler) {
    const button = document.createElement('button');
    const lang = document.documentElement.lang || 'en';

    button.setAttribute('type', 'button');
    button.setAttribute('lang', lang);
    button.setAttribute('aria-label', buttonText || 'In-page action');
    button.textContent = buttonText || 'Action';
    button.addEventListener('click', onClickHandler);

    return button;
  },

  addSvgAccessibleNames: function() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
      const title = svg.querySelector('title');
      if (title && title.textContent.trim()) {
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', title.textContent.trim());
      }
    });
  },

  ensureUniqueLandmarks: function() {
    const landmarks = document.querySelectorAll('[role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"], main, nav, aside, header, footer');
    const seen = new Map();
    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      const count = (seen.get(role) || 0) + 1;
      seen.set(role, count);
      if (count > 1 && !landmark.getAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  },

  fixFakeLink: function() {
    const fakeLinks = document.querySelectorAll('a[href=""], a[href="#"], span.clickable, div.clickable');
    fakeLinks.forEach(el => {
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.getAttribute('role')) el.setAttribute('role', 'link');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  },

  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTab);

    return () => element.removeEventListener('keydown', handleTab);
  },

  announce: function(message, priority = 'polite') {
    const liveRegion = document.getElementById('a11y-live-region') || (() => {
      const div = document.createElement('div');
      div.id = 'a11y-live-region';
      div.setAttribute('aria-live', priority);
      div.setAttribute('aria-atomic', 'true');
      div.style.position = 'absolute';
      div.style.left = '-999999px';
      document.body.appendChild(div);
      return div;
    })();
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
    }, 100);
  },

  handleArrowKeys: function(element, callback) {
    element.addEventListener('keydown', (e) => {
      const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (directions.includes(e.key)) {
        callback(e);
      }
    });
  },

  prefersReducedMotion: function() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  rotateBack: function(element) {
    if (element) {
      element.style.transform = 'rotate(0deg)';
      return element;
    }
  },

  addressAccessibilityIssues: function(report) {
    const results = {
      addressed: [],
      failed: []
    };

    if (!report || !report.data || !Array.isArray(report.data)) {
      return results;
    }

    report.data.forEach(issue => {
      try {
        switch (issue.type) {
          case 'fake-link':
            this.fixFakeLink();
            results.addressed.push(issue);
            break;
          case 'duplicate-landmark':
          case 'non-unique-landmark':
            this.ensureUniqueLandmarks();
            results.addressed.push(issue);
            break;
          case 'missing-svg-title':
          case 'svg-without-name':
            this.addSvgAccessibleNames();
            results.addressed.push(issue);
            break;
          case 'missing-language':
            const html = document.documentElement;
            if (!html.getAttribute('lang')) {
              html.setAttribute('lang', 'en');
              results.addressed.push(issue);
            }
            break;
          case 'missing-alt-text':
            const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
            imagesWithoutAlt.forEach(img => {
              img.setAttribute('alt', '');
              img.setAttribute('role', 'presentation');
            });
            results.addressed.push(issue);
            break;
          case 'missing-heading':
            const mainContent = document.querySelector('main');
            if (mainContent && !mainContent.querySelector('h1, h2, h3, h4, h5, h6')) {
              const heading = document.createElement('h1');
              heading.textContent = 'Main Content';
              heading.style.position = 'absolute';
              heading.style.left = '-9999px';
              mainContent.insertBefore(heading, mainContent.firstChild);
            }
            results.addressed.push(issue);
            break;
          case 'missing-form-label':
            const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
            inputs.forEach(input => {
              const id = input.id || `auto-label-${Math.random().toString(36).substr(2, 9)}`;
              if (!input.id) input.id = id;
              const label = document.createElement('label');
              label.htmlFor = id;
              label.textContent = 'Label';
              label.style.position = 'absolute';
              label.style.left = '-9999px';
              input.parentNode.insertBefore(label, input);
            });
            results.addressed.push(issue);
            break;
          case 'missing-button-name':
          case 'empty-button':
            const emptyButtons = document.querySelectorAll('button:empty');
            emptyButtons.forEach(btn => {
              btn.setAttribute('aria-label', 'Button');
            });
            results.addressed.push(issue);
            break;
          case 'link-empty-text':
          case 'empty-link':
            const emptyLinks = document.querySelectorAll('a:empty');
            emptyLinks.forEach(link => {
              const text = link.getAttribute('href') || 'Link';
              link.textContent = text;
            });
            results.addressed.push(issue);
            break;
          default:
            results.failed.push(issue);
        }
      } catch (error) {
        results.failed.push({ ...issue, error: error.message });
      }
    });

    return results;
  },

  initializeAccessibility: function() {
    this.addSvgAccessibleNames();
    this.ensureUniqueLandmarks();
    this.fixFakeLink();
    this.handleArrowKeys();
  },

  initialize: function() {
    this.initializeAccessibility();
  }
};

function analyzeAccessibility(issuesData) {
  return issuesData;
}

function generateAccessibilityReport(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData);
  const report = {
    introduction: 'Accessibility report for the application',
    data: analyzedIssues,
    conclusions: ''
  };
  return report;
}