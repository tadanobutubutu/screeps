// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Ensure unique landmarks

// ... (previously existing content)

/**
 * Main entry point for the application
 */
function main() {
    const landmarks = ['main'];
    let html = '<!DOCTYPE html><html><head><title>Dependencies</title><html lang="en">'; // Add lang attribute
    html += '<body>';
    html += '<h1>Dependency Index</h1>';
    html += '<ul id="landmarks">'; // Give the unordered list landmark role

    for (let i = 0; i < landmarks.length; i++) {
        html += `<landmark role="${landmarks[i]}">`;
        html += '</landmark>'; // Close the landmark if it's not the last one
    }

    html += '<ul>';
    // ... (previously existing content that generates the list of packages)

    html += '</ul></landmark></body></html>'; // Landmark for the main content

    return { graphData: renderDependencyGraph(dependencies), indexHtml: html };
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main
};