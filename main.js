// Accessibility checks on tables - function to be implemented
function checkTableAccessibility(tableElement) {
    const issues = [];
    
    // Check if table has a caption
    const caption = tableElement.querySelector('caption');
    if (!caption) {
        issues.push('Table should have a caption for accessibility');
    }
    
    // Check if table has header cells (th)
    const headers = tableElement.querySelectorAll('th');
    if (headers.length === 0) {
        issues.push('Table should have header cells (th) for accessibility');
    }
    
    // Check if header cells have scope attribute
    headers.forEach((th, index) => {
        if (!th.hasAttribute('scope') && !th.getAttribute('headers')) {
            issues.push(`Header cell at index ${index} should have a scope or headers attribute`);
        }
    });
    
    // Check if table uses thead and tbody
    if (!tableElement.querySelector('thead')) {
        issues.push('Table should use thead element');
    }
    if (!tableElement.querySelector('tbody')) {
        issues.push('Table should use tbody element');
    }
    
    return issues;
}