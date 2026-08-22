// Common Accessibility Fixes for React Components:

// 1. REACT_015 - Add lang attribute (typically in _app.js or layout component)
// <html lang="en">
function setHtmlLang(lang = 'en') {
  return {
    pattern: /<html[^>]*>/,
    replacement: (match) => {
      if (/lang\s*=/.test(match)) {
        return match.replace(/lang\s*=\s*["'][^"']*["']/, `lang="${lang}"`);
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
      const foundLandmarks = landmarks.filter(lm => new RegExp(`<${lm}[^>]*>`, 'i').test(html));
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
      const navMatches = html.match(/<nav[^>]*>/gi) || [];
      return {
        hasMultipleMains: mainMatches.length > 1,
        mainCount: mainMatches.length,
        hasNavWithId: navMatches.some(n => /id\s*=/.test(n)),
        isValid: mainMatches.length <= 1
      };
    },
    fixMultipleMains: (html) => {
      const mainMatches = html.match(/<main[^>]*>/gi) || [];
      if (mainMatches.length <= 1) return html;
      
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
        if (attrs && /id\s*=/.test(attrs)) {
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
        const hasThead = /<thead/i.test(table);
        const hasTbody = /<tbody/i.test(table);
        const hasTh = /<th/i.test(table);
        const hasScopeCol = /scope\s*=\s*["']col["']/i.test(table);
        
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
        fixed = tableHtml.replace(/(<table[^>]*>)([\s\S]*?)(<\/table>)/gi, (match, open, content, close) => {
          // Extract first row if exists
          const firstRow = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/i);
          if (firstRow) {
            const theadContent = firstRow[0].replace(/<td/gi, '<th scope="col"').replace(/<\/td>/gi, '</th>');
            const tbodyContent = content.replace(firstRow[0], '');
            return `${open}<thead>${theadContent}</thead><tbody>${tbodyContent}</tbody>${close}`;
          }
          return match;
        });
      }
      
      // Add scope="col" to th elements if missing
      fixed = fixed.replace(/<th([^>]*)(?<!scope\s*=\s*["'][^"']*["'])>/gi, (match, attrs) => {
        if (attrs && /scope\s*=/.test(attrs)) {
          return match;
        }
        return `<th scope="col"${attrs}>`;
      });
      
      return fixed;
    }
  };
}

// 5. REACT_036 - Use <button> instead of <a> for non-navigation elements
// <button ... instead of <a href="#" ...
function useSemanticButtons() {
  return {
    validate: (html) => {
      const fakeLinks = html.match(/<a[^>]*href\s*=\s*["']#["'][^>]*>(?!.*(?:menu|nav|navigation|link|skip|back|next|previous))/gi) || [];
      return {
        count: fakeLinks.length,
        links: fakeLinks,
        isValid: fakeLinks.length === 0
      };
    },
    convertToButton: (html) => {
      return html.replace(/<a\s+([^>]*?)href\s*=\s*["']#["']([^>]*)>([\s\S]*?)<\/a>/gi, (match, beforeAttrs, afterAttrs, content) => {
        // Remove any href, target, rel attributes
        const cleanAttrs = beforeAttrs.replace(/\s*(href|target|rel)\s*=\s*["'][^"']*["']/gi, '')
                                .replace(/\s*(href|target|rel)\s*=\s*["'][^"']*["']/gi, '')
                                .trim();
        return `<button ${cleanAttrs} ${afterAttrs}>${content}</button>`;
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
// OR use aria-hidden="true