// Common Accessibility Fixes for React Components:

// 1. REACT_015 - Add lang attribute (typically in _app.js or layout component)
// <html lang="en">
function setHtmlLang(lang = 'en') {
  return {
    pattern: /<html[^>]*>/,
    replacement: (match) => {
      if (match.includes('lang=')) {
        return match.replace(/lang=["'][^"']*["']/, `lang="${lang}"`);
      }
      return match.replace('>', ` lang="${lang}">`);
    }
  };
}

// 2. REACT_017 - Use semantic landmarks
// <header>, <nav>, <main>, <footer>, <aside>
function useSemanticLandmarks() {
  return {
    validLandmarks: ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'],
    requiredLandmarks: ['main'],
    getLandmark: (element) => `<${element}>`,
    validateLandmark: (html) => {
      const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
      const foundLandmarks = landmarks.filter(lm => html.includes(`<${lm}`));
      return {
        hasMain: foundLandmarks.includes('main'),
        landmarks: foundLandmarks,
        isValid: foundLandmarks.includes('main')
      };
    }
  };
}

// 3. REACT_025 - Ensure unique landmark regions
// Don't have multiple <main> elements, use unique IDs for navigation
// FIX: Keep a single <main> element and use <section> or <article> for other regions
// Example:
// Instead of:
//   {isError ? <main>Error content</main> : <main>Success content</main>}
// Use:
//   <main>
//     {isError ? <section>Error content</section> : <section>Success content</section>}
//   </main>
function ensureUniqueLandmarks() {
  return {
    validate: (html) => {
      const mainMatches = html.match(/<main[^>]*>/gi) || [];
      return {
        hasMultipleMains: mainMatches.length > 1,
        mainCount: mainMatches.length,
        hasNavWithId: /<nav[^>]*id=["'][^"']+["'][^>]*>/i.test(html) || /<nav[^>]*>[\s\S]*?id=["'][^"']+["']/i.test(html),
        isValid: mainMatches.length <= 1
      };
    },
    fixMultipleMains: (html) => {
      const mainMatches = html.match(/<main[^>]*>/gi) || [];
      if (mainMatches.length <= 1) return html;
      
      // Keep only the first <main> element, convert others to <section>
      let count = 0;
      return html.replace(/<main([^>]*)>/gi, (match, attrs) => {
        if (count === 0) {
          count++;
          return match;
        }
        count++;
        return `<section${attrs}>`;
      });
    },
    addUniqueIds: (html) => {
      let navCount = 0;
      return html.replace(/<nav([^>]*)>/gi, (match, attrs) => {
        if (attrs.includes('id=')) {
          return match;
        }
        navCount++;
        return `<nav id="nav-${navCount}"${attrs}>`;
      });
    }
  };
}

// 4. REACT_027 - Proper table structure
/*
<table>
  <thead>
    <tr>
      <th scope="col">Header 1</th>
      <th scope="col">Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
*/
function fixTableStructure() {
  return {
    validate: (html) => {
      const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
      return tables.map((table, index) => {
        const hasThead = /<thead[\s\S]*?<\/thead>/i.test(table);
        const hasTbody = /<tbody[\s\S]*?<\/tbody>/i.test(table);
        const hasTh = /<th[\s\S]*?>/i.test(table);
        const hasScopeCol = /<th[^>]*scope=["']col["']/i.test(table);
        
        return {
          index,
          isValid: hasThead && hasTbody && hasTh && hasScopeCol,
          hasThead,
          hasTbody,
          hasTh,
          hasScopeCol
        };
      });
    },
    fixTable: (tableHtml) => {
      // Add thead if missing
      let fixed = tableHtml;
      if (!/<thead/i.test(tableHtml)) {
        fixed = fixed.replace(/(<table[^>]*>)([\s\S]*?)(<\/table>)/i, (match, open, content, close) => {
          // Extract first row if exists
          const firstRow = content.match(/<tr[\s\S]*?<\/tr>/i);
          if (firstRow) {
            const theadContent = firstRow[0].replace(/<td/gi, '<th scope="col"').replace(/<\/td>/gi, '</th>');
            return `${open}<thead>${theadContent}</thead><tbody>${content.replace(firstRow[0], '')}</tbody>${close}`;
          }
          return match;
        });
      }
      
      // Add scope="col" to th elements if missing
      fixed = fixed.replace(/<th(\s[^>]*)?>/gi, (match, attrs) => {
        if (attrs && attrs.includes('scope=')) {
          return match;
        }
        return `<th scope="col"${attrs || ''}>`;
      });
      
      return fixed;
    }
  };
}

// 5. REACT_036 - Use <button> instead of <a> for non-navigation elements
// <button ... instead of <a href="#" ...
function convertFakeLinksToButtons() {
  return {
    validate: (html) => {
      const fakeLinks = html.match(/<a\s+href=["']#["'][^>]*>/gi) || [];
      return {
        count: fakeLinks.length,
        links: fakeLinks,
        isValid: fakeLinks.length === 0
      };
    },
    convertToButton: (html) => {
      return html.replace(/<a\s+href=["']#["']([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, content) => {
        // Remove any href, target, rel attributes
        const cleanAttrs = attrs.replace(/\s+href=["'][^"']*["']/gi, '')
                                .replace(/\s+target=["'][^"']*["']/gi, '')
                                .replace(/\s+rel=["'][^"']*["']/gi, '');
        return `<button${cleanAttrs}>${content}</button>`;
      });
    },
    isNavigationLink: (elementHtml) => {
      // Check if the link contains navigation-related content
      const navIndicators = ['menu', 'nav', 'navigation', 'link', 'skip', 'back', 'next', 'previous'];
      const lowerHtml = elementHtml.toLowerCase();
      return navIndicators.some(indicator => lowerHtml.includes(indicator));
    }
  };
}

// 6. REACT_041 - Add accessible names to SVGs
// <svg aria-label="Close menu" role="img">
//   <title>Menu Icon</title>
//   <path d="..." />
// </svg>
// OR use aria-hidden="true" if purely decorative
function fixSvgAccessibility() {
  return {
    validate: (html) => {
      const svgs = html.match(/<svg[^>]*>[\s\S]*?<\/svg>/gi) || [];
      return svgs.map((svg, index) => {
        const hasAriaLabel = /aria-label=["'][^"']+["']/i.test(svg);
        const hasAriaLabelledby = /aria-labelledby=["'][^"']+["']/i.test(svg);
        const hasTitle = /<title[\s\S]*?<\/title>/i.test(svg);
        const hasRole = /role=["']img["']/i.test(svg);
        const hasAriaHidden = /aria-hidden=["']true["']/i.test(svg);
        
        const isAccessible = (hasAriaLabel || hasAriaLabelledby || (hasTitle && hasRole)) || hasAriaHidden;
        
        return {
          index,
          isAccessible,
          hasAriaLabel,
          hasAriaLabelledby,
          hasTitle,
          hasRole,
          hasAriaHidden,
          needsFix: !isAccessible
        };
      });
    },
    fixSvg: (svgHtml, label) => {
      let fixed = svgHtml;
      
      // If it's decorative, add aria-hidden
      if (!label) {
        if (!/aria-hidden/i.test(fixed)) {
          fixed = fixed.replace('<svg', '<svg aria-hidden="true"');
        }
        return fixed;
      }
      
      // Add aria-label
      if (!/aria-label/i.test(fixed)) {
        fixed = fixed.replace('<svg', `<svg aria-label="${label}"`);
      }
      
      // Add role="img" if not present
      if (!/role=/i.test(fixed)) {
        fixed = fixed.replace('<svg', '<svg role="img"');
      }
      
      // Add title if not present
      if (!/<title/i.test(fixed)) {
        fixed = fixed.replace('<svg', `<svg><title>${label}</title>`);
      }
      
      return fixed;
    },
    fixAllSvgs: (html) => {
      return html.replace(/<svg([^>]*)>([\s\S]*?)<\/svg>/gi, (match, attrs, content) => {
        // Check if already accessible
        if (/aria-label=["'][^"']+["']/i.test(match) || /aria-hidden=["']true["']/i.test(match)) {
          return match;
        }
        // Add aria-label with role="img"
        const label = 'Decorative icon';
        return `<svg${attrs} role="img" aria-label="${label}">${content}</svg>`;
      });
    }
  };
}

// Combined accessibility checker
function checkAccessibility(html) {
  const results = {
    REACT_015: setHtmlLang().validate?.(html) || { hasLang: /lang=["']/i.test(html) },
    REACT_017: useSemanticLandmarks().validateLandmark(html),
    REACT_025: ensureUniqueLandmarks().validate(html),
    REACT_027: fixTableStructure().validate(html),
    REACT_036: convertFakeLinksToButtons().validate(html),
    REACT_041: fixSvgAccessibility().validate(html)
  };
  
  const issues = [];
  if (!results.REACT_015?.hasLang) issues.push('REACT_015: Missing lang attribute');
  if (!results.REACT_017?.isValid) issues.push('REACT_017: Invalid semantic landmarks');
  if (!results.REACT_025?.isValid) issues.push(`REACT_025: ${results.REACT_025.mainCount} main elements found`);
  if (results.REACT_027.some(r => !r.isValid)) issues.push('REACT_027: Tables missing proper structure');
  if (!results.REACT_036?.isValid) issues.push(`REACT_036: ${results.REACT_036.count} fake links found`);
  if (results.REACT_041.some(r => r.needsFix)) issues.push(`REACT_041: ${results.REACT_041.filter(r => r.needsFix).length} SVGs need accessible names`);
  
  return {
    score: Math.max(0, 100 - (issues.length * 2)),
    issues,
    details: results
  };
}

module.exports = { 
  accessibilityFixes: true,
  setHtmlLang,
  useSemanticLandmarks,
  ensureUniqueLandmarks,
  fixTableStructure,
  convertFakeLinksToButtons,
  fixSvgAccessibility,
  checkAccessibility
};