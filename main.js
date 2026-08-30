// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

async function isLinkAccessible(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return response.type === 'opaque' || response.ok;
  } catch (error) {
    return false;
  }
}

async function checkMultipleLinks(urls) {
  const results = [];
  for (const url of urls) {
    const isAccessible = await isLinkAccessible(url);
    results.push({ url, accessible: isAccessible });
  }
  return results;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  isLinkAccessible,
  checkMultipleLinks,
  isValidUrl
};