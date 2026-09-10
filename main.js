// TODO: This is the existing code that needs to be preserved
// Main application file

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

// Function to calculate distance between two points
function calculateDistance(point1, point2) {
  const R = 6.371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lon - point1.lon);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name;
    
    if (seen.has(identifier)) {
      identifier = `landmark_${getRandomInt(1, 99999)}`;
    }

    // Allow the new id to be assigned as landmark's id in further usage
    seen.add(identifier);
    ids.add(identifier);

    return { ...landmark, id: identifier };
  }).filter(landmark => landmark);
}

// Function to get a unique landmark identifier
function getUniqueLandmarkIdentifier(landmark) {
  return landmark.id || landmark.name || JSON.stringify(landmark);
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(htmlContent, lang = 'en') {
  const langAttrPattern = /\s*lang=["'][^"']*["']/i;
  
  if (langAttrPattern.test(htmlContent)) {
    return htmlContent.replace(langAttrPattern, `lang="${lang}"`);
  }
  
  const htmlTagMatch = htmlContent.match(/<html([^>]*)?>/i);
  if (htmlTagMatch) {
    const attrs = htmlTagMatch[1] || '';
    if (!attrs.includes('lang=')) {
      return htmlContent.replace(
        /<html([^>]*)?>/i,
        `<html${attrs} lang="${lang}">`
      );
    }
  }
  
  return htmlContent;
}

// REACT_017: Add main landmark to ensure proper landmark structure
function addMainLandmark(htmlContent) {
  const hasMainElement = /<main[\s>]/i.test(htmlContent);
  
  if (!hasMainElement) {
    const bodyMatch = htmlContent.match(/<body([^>]*)?>/i);
    if (bodyMatch) {
      const bodyTag = bodyMatch[0];
      const bodyAttrs = bodyMatch[1] || '';
      const mainElement = '<main>';
      const closingMainElement = '</main>';
      
      let updatedContent = htmlContent.replace(
        bodyTag,
        `${bodyTag}\n${mainElement}`
      );
      
      if (!updatedContent.includes(closingMainElement)) {
        const bodyCloseMatch = updatedContent.match(/<\/body>/i);
        if (bodyCloseMatch) {
          updatedContent = updatedContent.replace(
            /<\/body>/i,
            `${closingMainElement}\n</body>`
          );
        }
      }
      
      return updatedContent;
    }
  }
  
  return htmlContent;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(svgElements) {
  if (!Array.isArray(svgElements)) {
    svgElements = [svgElements];
  }
  
  return svgElements.map(svg => {
    if (!svg || typeof svg !== 'object') {
      return svg;
    }
    
    if (!svg.attributes) {
      svg.attributes = {};
    }
    
    if (!svg.attributes['aria-label'] && !svg.attributes.role) {
      svg.attributes.role = 'img';
      svg.attributes['aria-label'] = svg.attributes.title || 'SVG Icon';
    }
    
    return svg;
  });
}

// Added keyboard navigation support
function addKeyboardNavigation(element, callback) {
  if (!element || typeof callback !== 'function') {
    return;
  }
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback(event);
    }
  });
}

// Added ARIA labels for interactive elements
function setAriaLabel(element, label) {
  if (!element) {
    return;
  }
  element.setAttribute('aria-label', label);
}

// Added screen reader announcements
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
}

// Added focus trapping for modals
function trapFocus(modalElement) {
  if (!modalElement) {
    return;
  }

  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) {
    return;
  }

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  modalElement.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey && document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  });
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  addKeyboardNavigation,
  setAriaLabel,
  announceToScreenReader,
  trapFocus
};