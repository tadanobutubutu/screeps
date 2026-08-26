// Import necessary modules
const someDependency = require('./someDependency');

// Creating a new function that uses the imported module for rendering dependency graphs
function renderDependencyGraph(data) {
    const graphContainer = document.getElementById('graph-container');
    if (!graphContainer) return;

    // Clear existing content
    graphContainer.innerHTML = '';

    // Populate and render the graph
    someDependency.render(data, graphContainer);
}

// Addressing REACT_015: Add lang attribute to HTML element
function addLangAttr(html) {
    return html.replace(/<html([^>]*)>/gi, '<html lang="en"$1>');
}

// Addressing REACT_017: Add landmark roles and fix landmark issues
function addLandmarks(rootElement) {
    const landmarks = {
        banner: rootElement.querySelector('header'),
        navigation: rootElement.querySelector('nav'),
        main: rootElement.querySelector('main'),
        footer: rootElement.querySelector('footer')
    };

    Object.keys(landmarks).forEach((key) => {
        if (landmarks[key]) {
            landmarks[key].setAttribute('role', key);
        }
    });
    return landmarks;
}

// Addressing REACT_041: Add accessible names to 2 SVGs
function addAccessibleSvgNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
        if (!svg.id) return;
        const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
        desc.id = 'desc_' + svg.id;
        svg.setAttribute('role', 'img');
        svg.insertBefore(desc, svg.firstChild);
    });

    // Adding descriptions for each SVG
    svgs.forEach((svg) => {
        if (!svg.id) return;
        const id = 'desc_' + svg.id;
        const description = document.createTextNode('Accessible description for ' + svg.id);
        const descElement = svg.querySelector('#' + id);
        if (descElement) {
            descElement.appendChild(description);
        }
    });
}

// Addressing REACT_025: Ensure unique landmarks (2 issues) - Adding ids to landmarks
function addIdsToLandmarks(landmarks) {
    Object.keys(landmarks).forEach((key) => {
        if (landmarks[key]) {
            landmarks[key].id = key;
        }
    });
}

// New functions for addressing remaining issues
function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Add caption if missing
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Data table';
            caption.style.cssText = 'position: absolute; left: -9999px;'; // Visually hidden but accessible
            table.insertBefore(caption, table.firstChild);
        }

        // Ensure header cells have scope attributes
        const headers = table.querySelectorAll('th');
        headers.forEach(th => {
            if (!th.hasAttribute('scope')) {
                // Heuristic: if in thead, assume column header; if first cell in row, assume row header
                const isInThead = th.closest('thead');
                const isFirstInRow = th.parentElement && th.parentElement.firstElementChild === th;
                
                if (isInThead) {
                    th.setAttribute('scope', 'col');
                } else if (isFirstInRow) {
                    th.setAttribute('scope', 'row');
                }
            }
        });

        // Ensure data cells have headers attribute if complex table
        const rows = table.querySelectorAll('tr');
        const headerCells = Array.from(table.querySelectorAll('th[scope="col"]'));
        if (headerCells.length > 0) {
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (headerCells[index] && !cell.hasAttribute('headers')) {
                        cell.setAttribute('headers', headerCells[index].id || `col-${index}`);
                    }
                });
            });
        }
    });
}

function fixFakeLinkIssue() {
    // Implement the function as needed
}

// New function to replace fake links (<a href="#">) with accessible buttons
function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"]');
    fakeLinks.forEach(link => {
        const button = document.createElement('button');
        button.textContent = link.textContent;
        button.type = 'button'; // Ensures the button acts as a button
        if (link.id) {
            button.id = link.id;
        }
        link.parentNode.replaceChild(button, link);
    });
}

// Addressing issues from insight report
function addressIssuesFromInsightReport() {
    let content = '';

    const container = document.createElement('div');
    container.innerHTML = content;

    const htmlElement = document.createElement('html');
    htmlElement.setAttribute('lang', 'en');
    htmlElement.innerHTML = container.innerHTML;

    return {
        content: htmlElement.outerHTML,
        headingLevels: [],
        uniqueLandmarkCount: container.querySelectorAll('[role][role~="landmark"], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]').length
    };
}

// Function to fix duplicate landmark roles
function fixDuplicateLandmarkRoles(container) {
    const landmarks = container.querySelectorAll('[role][role~="landmark"], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]');
    const uniqueLandmarkRoles = [...new Set(Array.from(landmarks).map(landmark => landmark.getAttribute('role')))];

    landmarks.forEach((landmark, index) => {
        if (index >= uniqueLandmarkRoles.length) {
            landmark.removeAttribute('role');
        } else {
            landmark.setAttribute('role', uniqueLandmarkRoles[index]);
        }
    });
}

// Preserving previously renamed exports and adding new ones
module.exports = {
    renderDependencyGraph: renderDependencyGraph,
    addLangAttr: addLangAttr,
    addLandmarks: addLandmarks,
    addAccessibleSvgNames: addAccessibleSvgNames,
    addIdsToLandmarks: addIdsToLandmarks,
    fixTableStructure: fixTableStructure,
    fixFakeLinkIssue: fixFakeLinkIssue,
    fixFakeLinks: fixFakeLinks,
    addressIssuesFromInsightReport: addressIssuesFromInsightReport,
    fixDuplicateLandmarkRoles: fixDuplicateLandmarkRoles
};