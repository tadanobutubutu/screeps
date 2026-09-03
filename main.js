const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: config.allowedRoles,
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  name: 'ScreepsBot',
  version: '1.0.0',
  debug: false,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  landmarkRoles,
  maxLandmarks,
  allowedRoles
};

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'section:not([role])'
];

function enhanceKeyboardNavigation(options = {}) {
  const defaults = {
    landmarkKey: 'l',
    skipLinkKey: 's',
    announceLandmarks: true,
    autoInit: true
  };
  
  const settings = { ...defaults, ...options };
  
  let landmarkElements = [];
  let skipLinks = [];
  let announcementRegion = null;
  
  function collectLandmarks() {
    const elements = [];
    landmarkSelectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      found.forEach(el => elements.push(el));
    });
    return elements;
  }
  
  function focusLandmark(index) {
    const landmarks = collectLandmarks();
    if (landmarks.length > 0) {
      const targetIndex = ((index % landmarks.length) + landmarks.length) % landmarks.length;
      landmarks[targetIndex].setAttribute('tabindex', '-1');
      landmarks[targetIndex].focus();
      if (settings.announceLandmarks) {
        announceLandmark(landmarks[targetIndex]);
      }
    }
  }
  
  function announceLandmark(element) {
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    const label = element.getAttribute('aria-label') || '';
    const text = `Landmark: ${role}${label ? ', ' + label : ''}`;
    
    if (!announcementRegion) {
      announcementRegion = document.createElement('div');
      announcementRegion.setAttribute('role', 'status');
      announcementRegion.setAttribute('aria-live', 'polite');
      announcementRegion.setAttribute('aria-atomic', 'true');
      announcementRegion.style.position = 'absolute';
      announcementRegion.style.left = '-9999px';
      announcementRegion.style.width = '1px';
      announcementRegion.style.height = '1px';
      announcementRegion.style.overflow = 'hidden';
      document.body.appendChild(announcementRegion);
    }
    
    announcementRegion.textContent = '';
    setTimeout(() => {
      announcementRegion.textContent = text;
    }, 50);
  }
  
  function createSkipLinks() {
    const landmarks = collectLandmarks();
    const skipNav = document.createElement('div');
    skipNav.id = 'skip-nav';
    skipNav.style.position = 'absolute';
    skipNav.style.left = '-9999px';
    skipNav.style.top = 'auto';
    skipNav.style.width = '1px';
    skipNav.style.height = '1px';
    skipNav.style.overflow = 'hidden';
    
    landmarks.forEach((landmark, index) => {
      const link = document.createElement('a');
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      const label = landmark.getAttribute('aria-label') || '';
      
      link.href = '#';
      link.textContent = `Skip to ${role}${label ? ': ' + label : ''}`;
      link.onclick = (e) => {
        e.preventDefault();
        focusLandmark(index);
        skipNav.style.left = '-9999px';
      };
      
      skipNav.appendChild(link);
      skipLinks.push(link);
    });
    
    if (landmarks.length > 0) {
      document.body.insertBefore(skipNav, document.body.firstChild);
    }
    
    return skipNav;
  }
  
  function handleKeyDown(event) {
    if (event.key.toLowerCase() === settings.landmarkKey && event.altKey) {
      event.preventDefault();
      const currentFocus = document.activeElement;
      const landmarks = collectLandmarks();
      let currentIndex = -1;
      
      landmarks.forEach((landmark, index) => {
        if (landmark === currentFocus || landmark.contains(currentFocus)) {
          currentIndex = index;
        }
      });
      
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % landmarks.length : 0;
      focusLandmark(nextIndex);
    }
    
    if (event.key.toLowerCase() === settings.skipLinkKey && event.altKey) {
      event.preventDefault();
      const skipNav = document.getElementById('skip-nav');
      if (skipNav) {
        skipNav.style.left = '0';
        skipNav.style.width = 'auto';
        skipNav.style.height = 'auto';
        skipNav.style.overflow = 'visible';
        const firstLink = skipNav.querySelector('a');
        if (firstLink) {
          firstLink.focus();
        }
      }
    }
  }
  
  function init() {
    landmarkElements = collectLandmarks();
    createSkipLinks();
    document.addEventListener('keydown', handleKeyDown);
  }
  
  function destroy() {
    document.removeEventListener('keydown', handleKeyDown);
    const skipNav = document.getElementById('skip-nav');
    if (skipNav) {
      skipNav.remove();
    }
    if (announcementRegion) {
      announcementRegion.remove();
      announcementRegion = null;
    }
    skipLinks = [];
    landmarkElements = [];
  }
  
  if (settings.autoInit && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
  
  return {
    focusLandmark,
    collectLandmarks,
    init,
    destroy,
    settings
  };
}

module.exports = {
  config,
  CONFIG,
  landmarkSelectors,
  enhanceKeyboardNavigation
};

// ... (Unchanged rest of the code)