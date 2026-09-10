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
    
    const identifier = landmark.id || landmark.name || null;
    
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

// Function to improve accessibility by ensuring landmark names are screen-reader friendly
function improveAccessibility(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return landmark;
  }

  // Ensure each landmark has an accessible name and description for screen readers
  if (landmark.name && !landmark.ariaLabel) {
    landmark.ariaLabel = landmark.name;
  }

  if (landmark.description && !landmark.ariaDescription) {
    landmark.ariaDescription = landmark.description;
  }

  // Provide a default accessible role if missing
  if (!landmark.role) {
    landmark.role = 'region';
  }

  return landmark;
}

// Function to enhance accessibility across a collection of landmarks
function enhanceLandmarksAccessibility(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  return landmarks.map(improveAccessibility);
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  improveAccessibility,
  enhanceLandmarksAccessibility
};