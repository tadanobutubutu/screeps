// TODO: Create or update the affected functions to be accessible
export function renderDependencyGraphPage() {
  const content = `
    <html>
      <head>
        <!-- Head content here -->
      </head>
      <body>
        <main>
          <table id="table-rotated">
            <!-- Table content here -->
          </table>
        </main>
        <!-- Rest of the body content -->
      </body>
    </html>
  `;
  // Code to actually render the HTML content
}

// TODO: Implement this function for checking link accessibility
/**
 * Checks the accessibility of a single link URL
 * @param {string} url - The URL to check
 * @returns {Promise<{url: string, accessible: boolean, status: number|null, error: string|null}>}
 */
export async function checkLinkAccessibility(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    
    // In no-cors mode, opaque responses don't have status
    // so we consider them accessible if no error was thrown
    return {
      url,
      accessible: true,
      status: response.status || 0,
      error: null
    };
  } catch (error) {
    return {
      url,
      accessible: false,
      status: null,
      error: error.message
    };
  }
}

/**
 * Checks accessibility of multiple links
 * @param {string[]} urls - Array of URLs to check
 * @returns {Promise<Array<{url: string, accessible: boolean, status: number|null, error: string|null}>>}
 */
export async function checkLinksAccessibility(urls) {
  const results = await Promise.all(
    urls.map(url => checkLinkAccessibility(url))
  );
  return results;
}

/**
 * Extracts links from HTML content
 * @param {string} htmlContent - The HTML content to parse
 * @returns {string[]} - Array of unique URLs found in the HTML
 */
export function extractLinksFromHtml(htmlContent) {
  const linkRegex = /href=["']([^"']+)["']/gi;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(htmlContent)) !== null) {
    const url = match[1];
    // Only include absolute URLs (starting with http/https)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      links.push(url);
    }
  }
  
  return [...new Set(links)];
}

/**
 * Checks accessibility of all links in HTML content
 * @param {string} htmlContent - The HTML content to check
 * @returns {Promise<{accessible: string[], inaccessible: string[]}>}
 */
export async function checkHtmlLinkAccessibility(htmlContent) {
  const links = extractLinksFromHtml(htmlContent);
  const results = await checkLinksAccessibility(links);
  
  const accessible = [];
  const inaccessible = [];
  
  results.forEach(result => {
    if (result.accessible) {
      accessible.push(result.url);
    } else {
      inaccessible.push({ url: result.url, error: result.error });
    }
  });
  
  return { accessible, inaccessible };
}