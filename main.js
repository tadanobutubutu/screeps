// Add scope="col" to all table header cells
const headers = document.querySelectorAll('th');
headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
    }
});

// Preserve existing exports and functions
// (No actual exports shown in original query - implementation would depend on specific code)