// main.js
// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

function rotateElement(element) {
    const currentRotation = parseInt(element.getAttribute('data-rotation') || '0', 10);
    element.setAttribute('data-rotation', (currentRotation + 90) % 360);
    element.style.transform = `rotate(${element.getAttribute('data-rotation')}deg)`;
}

function unrotateElement(element) {
    element.setAttribute('data-rotation', '0');
    element.style.transform = 'rotate(0deg)';
}

document.addEventListener('DOMContentLoaded', () => {
    // Accessibility enhancements
    // Skip navigation link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.id = 'skip-link';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Handle skip link click
    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.tabIndex = -1;
            mainContent.focus();
            mainContent.scrollIntoView();
        }
    });

    // Mark the main content area as a primary region
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.id = 'main-content';
        mainElement.setAttribute('role', 'main');
        mainElement.setAttribute('aria-label', 'Main content');
    }

    // Additional changes to address accessibility issues:

    // React Language Attribute - Ensure that the language attribute is set on the HTML element
    document.documentElement.setAttribute('lang', 'en');

    // React Table Structure - Ensure that tables have appropriate headers and roles
    document.querySelectorAll('table').forEach(table => {
        if (!table.querySelector('th')) {
            table.setAttribute('role', 'presentation'); // Tables without headers are presentational
        } else {
            table.setAttribute('role', 'table');
            table.querySelector('thead').setAttribute('role', 'rowgroup');
            table.querySelectorAll('th').forEach((th, index) => {
                th.setAttribute('role', 'columnheader');
                th.setAttribute('scope', index === 0 ? 'colgroup' : 'row');
            });
            table.querySelectorAll('tbody').forEach((tbody, index) => {
                tbody.setAttribute('role', 'rowgroup');
                tbody.querySelectorAll('tr').forEach((tr, rowIndex) => {
                    tr.setAttribute('role', 'row');
                    tr.querySelectorAll('td').forEach((td, cellIndex) => {
                        td.setAttribute('role', 'cell');
                        td.setAttribute('scope', cellIndex === 0 ? 'rowgroup' : 'row');
                    });
                });
            });
        }
    });

    // React SVG Accessible Name - Ensure that SVGs have an accessible name
    document.querySelectorAll('svg').forEach(svg => {
        if (!svg.querySelector('title') && !svg.querySelector('desc')) {
            const title = document.createElement('title');
            title.textContent = 'SVG content description';
            svg.appendChild(title);
        }
    });

    // React Unique Landmarks - Ensure that landmarks are unique within the document
    const landmarkElements = ['main', 'nav', 'aside', 'header', 'footer', 'article', 'section'];
    landmarkElements.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        elements.forEach((element, index) => {
            element.setAttribute('id', `${landmark}-${index}`);
        });
    });

    // React Landmarks - Ensure that landmarks are defined
    document.querySelectorAll('main').forEach(main => {
        main.setAttribute('role', 'main');
    });
    document.querySelectorAll('nav').forEach(nav => {
        nav.setAttribute('role', 'navigation');
    });
    document.querySelectorAll('aside').forEach(aside => {
        aside.setAttribute('role', 'complementary');
    });
    document.querySelectorAll('header').forEach(header => {
        header.setAttribute('role', 'banner');
    });
    document.querySelectorAll('footer').forEach(footer => {
        footer.setAttribute('role', 'contentinfo');
    });
    document.querySelectorAll('article').forEach(article => {
        article.setAttribute('role', 'article');
    });
    document.querySelectorAll('section').forEach(section => {
        section.setAttribute('role', 'region');
    });

    // React Fake Link - Ensure that links with `aria-label` are not used as fake links
    document.querySelectorAll('a[aria-label]').forEach(link => {
        link.setAttribute('role', 'link');
    });

    // Rotate functionality
    const rotatable = document.getElementById('rotatable');
    const rotateBtn = document.getElementById('rotate');
    const unrotateBtn = document.getElementById('unrotate');

    if (rotateBtn) {
        rotateBtn.addEventListener('click', () => rotateElement(rotatable));
    }

    if (unrotateBtn) {
        unrotateBtn.addEventListener('click', () => unrotateElement(rotatable));
    }
});