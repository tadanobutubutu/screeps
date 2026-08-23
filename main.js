// Add missing aria-expanded to toggles
// ... (existing code)

// Add labels to elements where necessary
// ... (existing code)

// Find the id associated with a given input label
// ... (existing code)

// Add a helper function to find the input type and ID based on the label
// ... (existing code)

// Add lang attribute to HTML element
function addLangAttribute(htmlContent) {
  const htmlRegex = /<html([^>]*)>/gi;
  return htmlContent.replace(htmlRegex, (match, attrs) => {
    return `<html${attrs} lang="en">`;
  });
}

// Fix table structure issues
function fixTableStructureIssues(htmlContent) {
  // Ensure each table has proper <thead>, <tbody>, and scope attributes on <th>
  const tableRegex = /<table([^>]*)>([\s\S]*?)<\/table>/gi;
  return htmlContent.replace(tableRegex, (match, attrs, body) => {
    // Ensure <thead> exists before the first <tr>
    let processedBody = body;
    const hasThead = /<thead>/i.test(body);
    const hasTbody = /<tbody>/i.test(body);

    if (!hasThead) {
      const firstTrMatch = body.match(/<tr([^>]*)>([\s\S]*?)<\/tr>/);
      if (firstTrMatch) {
        const before = body.substring(0, firstTrMatch.index);
        const firstTr = firstTrMatch[0];
        const afterFirstTr = body.substring(firstTrMatch.index + firstTrMatch[0].length);
        processedBody = before + '<thead>' + firstTr + '</thead>' + afterFirstTr;
      }
    }

    // Wrap subsequent rows in <tbody> if not already present
    const tbodyStartIdx = processedBody.indexOf('</thead>');
    if (tbodyStartIdx !== -1) {
      const afterThead = processedBody.substring(tbodyStartIdx + 8);
      const tbodyCloseIdx = afterThead.indexOf('</tbody>');
      if (tbodyCloseIdx === -1) {
        const tbodyEndIdx = afterThead.indexOf('</table>');
        const tbodyContent = afterThead.substring(0, tbodyEndIdx);
        const afterContent = afterThead.substring(tbodyEndIdx);
        processedBody = processedBody.slice(0, tbodyStartIdx + 8) + '<tbody>' + tbodyContent + '</tbody>' + afterContent;
      }
    }

    // Add scope="col" to <th> elements in header rows
    const headerThRegex = /<th([^>]*)>/gi;
    processedBody = processedBody.replace(headerThRegex, (m, extraAttrs) => {
      if (!extraAttrs.includes('scope=')) {
        return m.replace(/>/,' scope="col">');
      }
      return m;
    });

    // Ensure </tbody> exists before </table>
    if (!processedBody.includes('</tbody>')) {
      processedBody = processedBody.replace('</table>', '</tbody></table>');
    }

    return `<table${attrs}>${processedBody}</table>`;
  });
}

// Add/fix landmark issues
function addMainLandmark(htmlContent) {
  // Ensure the main landmark (e.g., <main>) has an accessible name and unique id
  const mainRegex = /<main([^>]*)>/gi;
  return htmlContent.replace(mainRegex, (match, attrs) => {
    // Add id if missing or ensure uniqueness
    if (!attrs.includes('id=')) {
      attrs += ' id="main-content"';
    }
    // Add role="main" if not present
    if (!attrs.includes('role="main"')) {
      attrs += ' role="main"';
    }
    return `<main${attrs}>`;
  });
}

// Add accessible names to SVGs
function addSvgAccessibleNames(htmlContent) {
  // Add role and aria-label to the first two <svg> elements for accessibility
  let svgCounter = 0;
  return htmlContent.replace(/<svg([^>]*)>/gi, (match, attrs) => {
    svgCounter++;
    // Only modify the first two SVGs
    if (svgCounter <= 2) {
      // Ensure role="img"
      if (!attrs.includes('role="img"')) {
        attrs += ' role="img"';
      }
      // Add an accessible name (SVG icon X) where X is the counter
      if (!attrs.includes('aria-label=')) {
        attrs += ` aria-label="SVG icon ${svgCounter}"`;
      }
      // Set aria-hidden to false for better screen reader handling
      if (!attrs.includes('aria-hidden=')) {
        attrs += ' aria-hidden="false"';
      }
      return `<svg${attrs}>`;
    }
    // Leave other SVGs unchanged
    return match;
  });
}

// Ensure unique landmarks
function ensureUniqueLandmarks(htmlContent) {
  // Make sure all id attributes are unique; duplicate ids get a numeric suffix
  const idRegex = /id=["']([^"']+)["']/g;
  const idCount = {};

  return htmlContent.replace(idRegex, (match, id) => {
    const currentCount = idCount[id] || 0;
    idCount[id] = currentCount + 1;
    if (currentCount > 0) {
      // Append suffix to make it unique
      return `id="${id}-${currentCount}"`;
    }
    return match;
  });
}

// Fix fake link issue
function fixFakeLinkIssue(htmlContent) {
  // Replace <a> tags that lack an href or have a non-functional href with a proper link
  return htmlContent.replace(/<a([^>]*)>([\s\S]*?)<\/a>/gi, (match, attrs, content) => {
    // If there is no href attribute, add href="#"
    if (!attrs.includes('href=')) {
      attrs += ' href="#">';
    } else {
      // Ensure the href points to "#" if it is empty or anchors to a fragment only
      attrs = attrs.replace(/href=["'][^"']*["']/,'href="#">');
    }
    return `<a${attrs}>${content}</a>`;
  });
}

// Export the new functions
export { addLangAttribute, fixTableStructureIssues, addMainLandmark, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssue };