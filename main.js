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
      if (count > 1 && !landmark.id) {
        landmark.id = `${role} ${count}`;
      }
    });
  },

  fixFakeLink: function() {
    const fakeLinks = document.querySelectorAll('[data-fake-link]');
    fakeLinks.forEach(el => {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'link');
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
      div.style.left = '-9999px';
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

  rotateBack: function() {},

  renderIndexView: function(container, issuesData) {
    const analyzedIssues = this.analyzeAccessibility ? this.analyzeAccessibility(issuesData) : issuesData;
    const report = this.generateReport ? this.generateReport(analyzedIssues) : {
      introduction: 'Accessibility report for the application',
      data: analyzedIssues,
      conclusions: ''
    };

    const wrapper = document.createElement('div');
    wrapper.id = 'a11y-index-view';
    wrapper.setAttribute('role', 'main');
    wrapper.setAttribute('aria-labelledby', 'index-heading');

    const heading = document.createElement('h1');
    heading.id = 'index-heading';
    heading.textContent = report.introduction || 'Accessibility Index';
    wrapper.appendChild(heading);

    if (report.data && report.data.length > 0) {
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', 'Issue navigation');

      const list = document.createElement('ul');
      list.setAttribute('role', 'list');

      report.data.forEach((issue, index) => {
        const item = document.createElement('li');
        item.setAttribute('role', 'listitem');

        const link = document.createElement('a');
        const issueId = `a11y-issue-${index}`;
        link.href = `#${issueId}`;
        link.textContent = issue.title || `Issue ${index + 1}`;
        link.setAttribute('aria-describedby', `${issueId}-desc`);

        const desc = document.createElement('span');
        desc.id = `${issueId}-desc`;
        desc.className = 'a11y-issue-description';
        desc.textContent = issue.description || '';

        item.appendChild(link);
        item.appendChild(document.createElement('br'));
        item.appendChild(desc);
        list.appendChild(item);
      });

      nav.appendChild(list);
      wrapper.appendChild(nav);
    } else {
      const noIssues = document.createElement('p');
      noIssues.textContent = 'No accessibility issues found.';
      noIssues.setAttribute('aria-live', 'polite');
      wrapper.appendChild(noIssues);
    }

    if (report.conclusions) {
      const conclusions = document.createElement('section');
      conclusions.setAttribute('aria-labelledby', 'conclusions-heading');

      const conclusionsHeading = document.createElement('h2');
      conclusionsHeading.id = 'conclusions-heading';
      conclusionsHeading.textContent = 'Conclusions';

      const conclusionsText = document.createElement('p');
      conclusionsText.textContent = report.conclusions;

      conclusions.appendChild(conclusionsHeading);
      conclusions.appendChild(conclusionsText);
      wrapper.appendChild(conclusions);
    }

    container.innerHTML = '';
    container.appendChild(wrapper);

    return wrapper;
  },

  initializeAccessibility: function() {
    this.addSvgAccessibleNames();
    this.ensureUniqueLandmarks();
    this.fixFakeLink();
  },

  initialize: function() {
    this.initializeAccessibility();
  },

  analyzeAccessibility: function(issuesData) {
    return issuesData;
  },

  generateReport: function(issuesData) {
    const analyzedIssues = this.analyzeAccessibility(issuesData);
    const report = {
      introduction: 'Accessibility report for the application',
      data: analyzedIssues,
      conclusions: ''
    };
    return report;
  }
};