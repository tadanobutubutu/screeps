// main.js

// Sample configuration
const config = {
  timeout: 5000,
  retryCount: 3
};

// Helper function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to check if a link is accessible
async function checkLinkAccessibility(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    });
    
    clearTimeout(timeoutId);
    return { url, accessible: true, status: response.status };
  } catch (error) {
    return { url, accessible: false, error: error.message };
  }
}

// Function to check multiple links
async function checkMultipleLinks(urls) {
  const results = [];
  for (const url of urls) {
    const result = await checkLinkAccessibility(url);
    results.push(result);
  }
  return results;
}

// Sample usage
async function main() {
  const links = [
    'https://example.com',
    'https://google.com',
    'https://invalid-domain-that-does-not-exist.xyz'
  ];
  
  const results = await checkMultipleLinks(links);
  console.log('Link Accessibility Results:', results);
}

// Run main function
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', main);
}

module.exports = { checkLinkAccessibility, checkMultipleLinks };