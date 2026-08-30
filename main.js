// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

async function isLinkAccessible(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'no-cors'
        });
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    isLinkAccessible
};