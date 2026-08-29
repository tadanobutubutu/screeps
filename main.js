// Main application file

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

// Function for ensuring unique landmarks (REACT_025)
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name || landmark.role || '';
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
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

// REACT_036: Fix fake link issues by ensuring proper anchor tags or button elements
function fixFakeLinkIssue(elements) {
  if (!Array.isArray(elements)) {
    elements = [elements];
  }
  
  return elements.map(element => {
    if (!element || typeof element !== 'object') {
      return element;
    }
    
    if (element.isFakeLink) {
      element.tagName = 'button';
      element.attributes = element.attributes || {};
      
      if (!element.attributes.type) {
        element.attributes.type = 'button';
      }
      
      delete element.isFakeLink;
    }
    
    return element;
  });
}

// REACT_027: Fix table structure issues
function fixTableStructureIssues(tables) {
  if (!Array.isArray(tables)) {
    tables = [tables];
  }
  
  return tables.map(table => {
    if (!table || typeof table !== 'object') {
      return table;
    }
    
    if (!table.rows || !Array.isArray(table.rows)) {
      return table;
    }
    
    const correctedRows = table.rows.map((row, rowIndex) => {
      const cellCount = row.cells ? row.cells.length : 0;
      
      if (row.type === 'header' && rowIndex === 0) {
        row.attributes = row.attributes || {};
        if (!row.attributes.scope) {
          row.attributes.scope = 'col';
        }
      }
      
      return row;
    });
    
    table.rows = correctedRows;
    
    if (!table.attributes) {
      table.attributes = {};
    }
    
    if (!table.caption && !table.attributes.summary) {
      table.needsCaption = true;
    }
    
    return table;
  });
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  fixTableStructureIssues,
};