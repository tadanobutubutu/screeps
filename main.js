export function rotateBack() {
  const targets = document.querySelectorAll('.rotate-item');
  targets.forEach(el => {
    el.style.transform = 'rotate(0deg)';
  });
}

// Primary content wrapping and enhancement
document.getElementById('primary-content').innerHTML = `
  <main>
    ${document.getElementById('primary-content').innerHTML}
  </main>
`;

// Replace the anchor element with a button and reattach click event listener
const unrotateButton = document.getElementById('unrotate');
unrotateButton.outerHTML = `
  <button id="unrotate" class="rotate-back-button" aria-label="Rotate back">
    rotate back
  </button>
`;
const newUnrotateButton = document.getElementById('unrotate');
newUnrotateButton.addEventListener('click', rotateBack);

// Preserve existing code, exports, and functions
const tableHeaders = document.querySelectorAll('th');
tableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

export function addLangAttribute() {
    const html = document.querySelector('html');
    if (html) {
        html.setAttribute('lang', 'en');
    }
}

export function addSvgAccessibleNames() {
    const svg1 = document.getElementById('svg1');
    if (svg1) {
        svg1.setAttribute('aria-label', "SVG element with ID svg1");
    }
    const svg2 = document.getElementById('svg2');
    if (svg2) {
        svg2.setAttribute('aria-label', "SVG element with ID svg2");
    }
}

export function addAriaLabelToMyDiv() {
    const link = document.getElementById('link');
    if (link) {
        link.setAttribute("href", "#"); // replace "#" with the appropriate URL
        if (!link.getAttribute('aria-label')) {
            link.setAttribute('aria-label', 'Accessible link description');
        }
    }
}

export function addUniqueIdToAccessibleElements() {
    const accessibleElements = document.querySelectorAll('[aria-label]');

    let elementIndex = 1;
    accessibleElements.forEach((element) => {
        if (element.getAttribute('id')) return; // Skip elements with an id attribute

        const currentId = `${element.nodeName.toLowerCase()}-${elementIndex}`;
        element.setAttribute('id', currentId);
        elementIndex++;
    });
}

export function wrapPrimaryContentInMain() {
    const mainContent = document.querySelector('.container'); // Assuming the primary content is within a div with class 'container'
    if (mainContent) {
        const mainTag = document.createElement('main');
        while (mainContent.firstChild) {
            mainTag.appendChild(mainContent.firstChild);
        }
        mainContent.appendChild(mainTag);
    }
}

export function addMainLandmark() {
    wrapPrimaryContentInMain();
}

export function fixTableStructureIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Ensure tables have proper structure
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');
                thead.appendChild(firstRow);
                table.insertBefore(thead, table.firstChild);

                // Move remaining rows to tbody
                let currentNode = thead.nextSibling;
                while (currentNode) {
                    const nextNode = currentNode.nextSibling;
                    if (currentNode.nodeName === 'TR') {
                        tbody.appendChild(currentNode);
                    }
                    currentNode = nextNode;
                }
                table.appendChild(tbody);
            }
        }

        // Ensure cells have proper scope attributes
        const headerCells = table.querySelectorAll('th');
        headerCells.forEach(th => {
            if (!th.hasAttribute('scope')) {
                const row = th.closest('tr');
                if (row && row.parentNode.nodeName === 'THEAD') {
                    th.setAttribute('scope', 'col');
                } else {
                    th.setAttribute('scope', 'row');
                }
            }
        });
    });
}

export function ensureUniqueLandmarks() {
    const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
    landmarks.forEach(role => {
        const elements = document.querySelectorAll(role);
        if (elements.length > 1) {
            let counter = 1;
            elements.forEach((el, index) => {
                if (index > 0) {
                    const ariaLabel = el.getAttribute('aria-label') || `${role}-${counter}`;
                    el.setAttribute('aria-label', ariaLabel);
                    counter++;
                }
            });
        }
    });
}

export function addAriaLabelToDuplicateLandmarks() {
    const duplicateLandmarks = document.querySelectorAll(
        ':not([id]):not([aria-label])',
    );
    let labelCounter = 1;

    duplicateLandmarks.forEach((element) => {
        const elementName = element.nodeName.toLowerCase();
        const duplicateElements = document.querySelectorAll(
            `:not([id]):not([aria-label]):not([${elementName}])`,
        );

        let uniqueId = false;

        duplicateElements.forEach((duplicateElement) => {
            if (element.getAttribute('id') === duplicateElement.getAttribute('id')) {
                uniqueId = true;
            }
        });

        if (!uniqueId) {
            element.setAttribute(
                'aria-label',
                `${elementName}-${labelCounter++}`,
            );
        }
    });
}

// Call the functions to address accessibility issues
addLangAttribute();
addSvgAccessibleNames();
addAriaLabelToMyDiv();
addMainLandmark();
fixTableStructureIssues();
ensureUniqueLandmarks();
addAriaLabelToDuplicateLandmarks();
addUniqueIdToAccessibleElements();