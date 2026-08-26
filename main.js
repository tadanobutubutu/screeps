function setHtmlLangAttribute(lang = 'en') {
    const html = document.querySelector('html');
    if (html && html.tagName) {
        html.setAttribute('lang', lang);
    }
}

function addSvgAccessibleNames(svg) {
    const svgTitle = svg.querySelector('title');
    const svgDesc = svg.querySelector('desc');
    if (!svgTitle || !svgDesc) {
        console.error('Missing required SVG tags: title or desc');
        return;
    }
    if (!svgTitle.id) {
        svgTitle.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
    }
    if (!svgDesc.id) {
        svgDesc.id = 'svg-desc-' + Math.random().toString(36).substr(2, 9);
    }
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', `${svgTitle.id} ${svgDesc.id}`);
}

function addAllSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        addSvgAccessibleNames(svg);
    });
}

// Unified fixInputAccessibility function
function fixInputAccessibility() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (!input.id) {
            input.id = 'input-' + Math.random().toString(36).substr(2, 9);
        }
        let label = document.querySelector(`label[for="${input.id}"]`);
        if (!label) {
            label = document.createElement('label');
            label.htmlFor = input.id;
            label.textContent = 'Input description';
            input.parentNode.insertBefore(label, input);
            label.id = 'label-' + input.id;
        } else {
            label.textContent = 'Input description';
            label.id = 'label-' + input.id;
        }
    });
}

// Unified addProperLandmarkRegions function
function addProperLandmarkRegions() {
    const landmarks = {
        banner: document.querySelectorAll('header'),
        navigation: document.querySelectorAll('nav'),
        main: document.querySelectorAll('main'),
        complementary: document.querySelectorAll('aside'),
        contentinfo: document.querySelectorAll('footer')
    };
    for (const type in landmarks) {
        landmarks[type].forEach(element => {
            if (element) {
                element.setAttribute('role', type);
            }
        });
    }
}

// Unified addAllTableHeadersScope function
function addAllTableHeadersScope() {
    const thElements = document.querySelectorAll('th');
    thElements.forEach(th => {
        th.setAttribute('scope', 'col');
    });
}

// Combined fixTableStructureIssues and fixTableConstraints functions
function fixTableIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const hasThead = table.querySelector('thead');
        if (!hasThead) {
            table.insertBefore(document.createElement('thead'), table.childNodes[0]);
        }
        const tableHeaders = table.querySelectorAll('th');
        tableHeaders.forEach(th => {
            th.setAttribute('scope', 'col');
        });
    });
}

// Reorganized and condensed additional functions
function getFullLangAttribute() {
    const html = document.querySelector('html');
    return html ? html.getAttribute('lang') : null;
}

function validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const hasHeader = table.querySelector('th');
        if (!hasHeader) {
            console.warn('Table missing header cells');
        }
    });
}

function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const hasThead = table.querySelector('thead');
        if (!hasThead) {
            console.warn('Table missing THEAD');
        }
    });
}

function validateLandmark() {
    const landmarks = document.querySelectorAll('[role]');
    if (landmarks.length === 0) {
        console.warn('No landmark regions found');
    }
}

function validateLandmarkStructure() {
    const main = document.querySelector('main');
    if (!main) {
        console.warn('Missing main landmark');
    }
}

function getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    return title ? title.textContent : '';
}

function createInPageButton(options = {}) {
    const defaults = {
        label: 'Click me'
    };
    const button = Object.assign(document.createElement('button'), defaults, options);
    return button;
}

function createAccessibleLink(options = {}) {
    const defaults = {
        label: 'Accessible link',
        href: '#'
    };
    const link = Object.assign(document.createElement('a'), defaults, options);
    return link;
}

function ensureMainLandmark() {
    let main = document.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        document.body.appendChild(main);
    }
    return main;
}

function wrapPrimaryContentInMain() {
    const main = ensureMainLandmark();
    const nonLandmarks = Array.from(document.body.children).filter(element => {
        const tag = element.tagName.toLowerCase();
        return !['header', 'nav', 'aside', 'footer', 'script', 'style'].includes(tag);
    });
    if (nonLandmarks.length === 0) {
        return;
    }
    nonLandmarks.forEach(child => main.appendChild(child));
}

function fixFakeLinkIssue() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const clickable = document.createElement('a');
        clickable.href = link.getAttribute('href') || '#';
        clickable.textContent = 'Click me';
        link.parentNode.insertBefore(clickable, link.nextSibling);
    });
}

export {
    setHtmlLangAttribute,
    addAllSvgAccessibleNames,
    fixInputAccessibility,
    addAllTableHeadersScope,
    addProperLandmarkRegions,
    fixTableIssues,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    wrapPrimaryContentInMain,
    ensureMainLandmark,
    fixFakeLinkIssue
};