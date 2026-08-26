import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

function getHeadingLevels(html) {
  const headingLevels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const headings = ...; // Assume this is defined elsewhere

  headings?.forEach(heading => {
    const headingLevel = ...; // Assume this is defined elsewhere
    headingLevels[headingLevel]++;
  });

  return headingLevels;
}

function addLandmarkRoles() {
  // Add landmark roles to main content
  const contentWithLandmarks = ...; // Assume this is defined elsewhere

  // Replace the original content with the updated one
  content = contentWithLandmarks;
}

function addSvgAccessibleNames() {
  // Add accessible names to SVGs
  const contentWithAccessibleNames = ... (svg) => {
    const ariaHiddenMatch = ...
    const hasAriaHidden = ariaHiddenMatch ? ariaHiddenMatch[0] : '';
    const svgWithAccessibleName = svg.replace(/<svg/g, `<svg ...

    if (!hasAriaHidden) {
      const ariaLabelMatch = ...
      const hasAriaLabel = ariaLabelMatch ? ariaLabelMatch[0] : '';
      const titleMatch = ...
      const hasTitle = titleMatch ? titleMatch[0] : '';

      if (!hasAriaLabel && !hasTitle) {
        // Add aria-label or title if not present
        if (titleMatch) {
          return ... `<title>Svg ...
        } else {
          return ... `<svg aria-label="Svg Description">`);
        }
      }
    }

    return svgWithAccessibleName;
  });

  // Replace the original content with the updated one
  content = contentWithAccessibleNames;
}

function ensureUniqueLandmarks() {
  // Check for and fix duplicate landmark roles
  // ... (You'll need to update this function based on your specific HTML structure)
}

function fixFakeLinkIssues() {
  // Find and fix fake link issues
  // ... (You'll need to update this function based on your specific HTML structure)
}

function addThScope() {
  // Add scope attribute to <th> elements
  // ... (You'll need to update this function based on your specific <th> elements)
}

// New Function for handling unique landmarks
function ensureUniqueLandmarksInHtml(html) {
  // Check for unique landmarks in the provided HTML
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
  const landmarkRegex = new RegExp(`<([a-z]+)[^>]*?(?:aria-label|role)="(${landmarkRoles.join('|')})"[^>]*>`, 'gi');
  const landmarks = [];
  let match;

  while ((match = landmarkRegex.exec(html)) !== null) {
    const role = match[2].toLowerCase();
    if (landmarks.includes(role)) {
      // If landmark already exists, add a unique aria-label
      const tag = match[1];
      const originalTag = match[0];
      const uniqueLabel = `${role}-${landmarks.filter(l => l === role).length + 1}`;
      const newTag = originalTag.replace(/aria-label="[^"]*"/, `aria-label="${uniqueLabel}"`).replace(/role="${role}"/, `role="${role}" aria-label="${uniqueLabel}"`);
      html = html.replace(originalTag, newTag);
    }
    landmarks.push(role);
  }

  return html;
}

function validateLandmarkRoles(html) {
  // Find landmark roles in the provided HTML
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
  const landmarkRegex = /<(?:nav|header|footer|main|aside|section|div)[^>]*(?:role|aria-label)="([a-z]+)"[^>]*>/gi;
  const landmarks = [];
  let match;

  while ((match = landmarkRegex.exec(html)) !== null) {
    const role = match[1].toLowerCase();
    if (landmarkRoles.includes(role)) {
      landmarks.push({ role, match: match[0] });
    }
  }

  return landmarks;
}

function countUniqueLandmarks(html) {
  // Count the unique landmark roles in the provided HTML
  const landmarks = validateLandmarkRoles(html);

  return new Set(landmarks.map(landmark => landmark.role)).size;
}

function ensureUniqueLandmark(html) {
  const landmarks = validateLandmarkRoles(html);
  const seenRoles = {};
  let result = html;

  landmarks.forEach((landmark, index) => {
    const role = landmark.role;
    if (seenRoles[role] !== undefined) {
      // Add unique aria-label to duplicate landmark
      const uniqueLabel = `${role}-${seenRoles[role] + 1}`;
      const newTag = landmark.match.replace(/>/, ` aria-label="${uniqueLabel}">`);
      result = result.replace(landmark.match, newTag);
      seenRoles[role]++;
    } else {
      seenRoles[role] = 0;
    }
  });

  return result;
}

function addLanguageAttribute(html) {
  // Add lang attribute to html element if missing
  if (!/<html[^>]*lang=/i.test(html)) {
    html = html.replace(/<html/i, '<html lang="en"');
  }
  return html;
}

function addTableScopes(html) {
  // Add scope attribute to th elements in tables
  const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
  
  return html.replace(tableRegex, (table) => {
    // Find all th elements in the table
    const thRegex = /<th(?![^>]*scope)[^>]*>([\s\S]*?)<\/th>/gi;
    
    return table.replace(thRegex, (thMatch, thContent) => {
      // Check if it's a row header (no rowspan) or column header
      const hasRowspan = /rowspan=/i.test(thMatch);
      
      if (!hasRowspan) {
        return thMatch.replace(/<th/, '<th scope="col"');
      }
      
      return thMatch.replace(/<th/, '<th scope="row"');
    });
  });
}

function fixSvgAccessibility(html) {
  // Add accessible names to SVGs that are not aria-hidden
  const svgRegex = /<svg(?![^>]*aria-hidden)(?![^>]*aria-label)(?![^>]*<title>)[^>]*>[\s\S]*?<\/svg>/gi;
  
  return html.replace(svgRegex, (svg) => {
    // Check if svg already has aria-label
    if (/aria-label=/i.test(svg)) {
      return svg;
    }
    
    // Check if svg has a title element
    if (/<title>/i.test(svg)) {
      return svg;
    }
    
    // Add aria-label with generic description
    return svg.replace(/<svg/, '<svg aria-label="Decorative icon"');
  });
}

function fixFakeLinks(html) {
  // Find anchor tags without href and add role="button"
  const anchorRegex = /<a(?![^>]*href)(?![^>]*role="button")[^>]*>[\s\S]*?<\/a>/gi;
  
  return html.replace(anchorRegex, (anchor) => {
    if (!/href=/i.test(anchor)) {
      // Add role="button" and tabindex="0" for keyboard accessibility
      return anchor.replace(/<a/, '<a role="button" tabindex="0"');
    }
    return anchor;
  });
}

function ensureLandmarkRoles(html) {
  // Add appropriate landmark roles to semantic elements
  const semanticMap = {
    '<header': '<header role="banner"',
    '<nav': '<nav role="navigation"',
    '<main': '<main role="main"',
    '<aside': '<aside role="complementary"',
    '<footer': '<footer role="contentinfo"'
  };

  let result = html;
  Object.entries(semanticMap).forEach(([selector, replacement]) => {
    const regex = new RegExp(selector.replace(/[<()>]/g, ''), 'gi');
    result = result.replace(regex, (match) => {
      // Only add role if not already present
      if (!/role=/i.test(match)) {
        return match.replace(/<(header|nav|main|aside|footer)/i, replacement);
      }
      return match;
    });
  });

  return result;
}

function addressAccessibilityIssues() {
  let content = dependencyGraphContent + indexContent;
  const results = { fixed: [], remaining: [] };

  // Add the lang attribute to the html element (REACT_015)
  const previousContent = content;
  content = addLanguageAttribute(content);
  if (content !== previousContent) {
    results.fixed.push('REACT_015: Added lang attribute to html element');
  }

  // Add landmark roles (REACT_017)
  const previousContentLandmarks = content;
  content = ensureLandmarkRoles(content);
  if (content !== previousContentLandmarks) {
    results.fixed.push('REACT_017: Added landmark roles to semantic elements');
  }

  // Ensure unique landmarks (REACT_025)
  const previousContentUnique = content;
  content = ensureUniqueLandmark(content);
  if (content !== previousContentUnique) {
    results.fixed.push('REACT_025: Ensured unique landmark roles');
  }

  // Add accessible names to SVGs (REACT_041)
  const previousContentSvg = content;
  content = fixSvgAccessibility(content);
  if (content !== previousContentSvg) {
    results.fixed.push('REACT_041: Added accessible names to SVGs');
  }

  // Fix fake links (REACT_036)
  const previousContentLinks = content;
  content = fixFakeLinks(content);
  if (content !== previousContentLinks) {
    results.fixed.push('REACT_036: Fixed fake link issues');
  }

  // Add scope attribute to th elements (REACT_027)
  const previousContentTh = content;
  content = addTableScopes(content);
  if (content !== previousContentTh) {
    results.fixed.push('REACT_027: Added scope attributes to th elements');
  }

  // Update the content references for other functions
  dependencyGraphContent = content.split(indexContent)[0];
  indexContent = content.split(indexContent)[1] || content.split(dependencyGraphContent)[1] || '';

  return results;
}

function addressIssuesFromInsightReport() {
  let content = dependencyGraphContent + indexContent;
  const results = addressAccessibilityIssues();

  // Add the lang attribute to the content
  content = addLanguageAttribute(content);

  // Add landmark roles
  const previousLandmarkContent = content;
  content = ensureLandmarkRoles(content);
  if (content !== previousLandmarkContent) {
    results.fixed.push('Added landmark roles');
  }

  // Add accessible names to SVGs
  const previousSvgContent = content;
  content = fixSvgAccessibility(content);
  if (content !== previousSvgContent) {
    results.fixed.push('Added accessible names to SVGs');
  }

  // Ensure unique landmarks
  const previousUniqueContent = content;
  content = ensureUniqueLandmark(content);
  if (content !== previousUniqueContent) {
    results.fixed.push('Ensured unique landmarks');
  }

  // Fix fake link issues
  const previousLinkContent = content;
  content = fixFakeLinks(content);
  if (content !== previousLinkContent) {
    results.fixed.push('Fixed fake link issues');
  }

  // Add scope attribute to th elements
  const previousThContent = content;
  content = addTableScopes(content);