// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

function isLinkAccessible(url) {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    return false;
  }
}

module.exports = {
  isLinkAccessible
};