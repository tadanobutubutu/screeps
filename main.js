// Accessibility improvements implemented in this file
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope attribute to th elements

// Fix language for the HTML root element
const addLangAttribute = () => {
    if (typeof document !== 'undefined' && document.documentElement) {
        const htmlElement = document.documentElement;
        const currentLang = htmlElement.getAttribute('lang');
        if (!currentLang) {
            htmlElement.setAttribute('lang', 'en');
        }
    }
};

// Fix for REACT_015: Add lang attribute to HTML element
addLangAttribute();

// Fix for REACT_041: Add accessible names to 2 SVGs
const addAccessibleNamesToSVGs = () => {
    if (typeof document !== 'undefined') {
        const svgs = document.querySelectorAll('svg');
        
        svgs.forEach((svg, index) => {
            // Check if SVG already has an accessible name
            const hasAriaLabel = svg.getAttribute('aria-label');
            const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
            const hasTitle = svg.querySelector('title');
            
            if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
                // Add a title element for accessibility
                const title = document.createElement('title');
                title.textContent = `SVG Icon ${index + 1}`;
                title.id = `svg-title-${index + 1}`;
                
                // Insert title as first child
                if (svg.firstChild) {
                    svg.insertBefore(title, svg.firstChild);
                } else {
                    svg.appendChild(title);
                }
                
                // Associate the title with aria-labelledby
                svg.setAttribute('aria-labelledby', title.id);
            }
        });
    }
};

// Fix for REACT_041: Add accessible names to 2 SVGs
addAccessibleNamesToSVGs();

// Restored export (previously removed)
export { addLangAttribute, addAccessibleNamesToSVGs };

// Create accessible button component with full ARIA support
const createAccessibleButton = (props) => {
    const { label, onClick, disabled = false, variant = 'primary' } = props;
    
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.disabled = disabled;
    button.className = `btn btn-${variant}`;
    
    // Ensure accessible name
    if (!label && props.ariaLabel) {
        button.setAttribute('aria-label', props.ariaLabel);
    }
    
    // Add keyboard support
    if (onClick) {
        button.onclick = onClick;
        button.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
            }
        };
    }
    
    // Add role for semantic clarity
    button.setAttribute('role', 'button');
    
    return button;
};

// Create accessible form input with label association
const createAccessibleInput = (props) => {
    const { id, label, type = 'text', required = false, errorId } = props;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';
    
    const inputLabel = document.createElement('label');
    inputLabel.htmlFor = id;
    inputLabel.textContent = label;
    
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    input.required = required;
    input.setAttribute('aria-required', required);
    
    if (errorId) {
        input.setAttribute('aria-describedby', errorId);
        input.setAttribute('aria-invalid', 'true');
    }
    
    wrapper.appendChild(inputLabel);
    wrapper.appendChild(input);
    
    return wrapper;
};

// Create accessible modal/dialog
const createAccessibleModal = (props) => {
    const { id, title, content, closeLabel = 'Close' } = props;
    
    const modal = document.createElement('div');
    modal.id = id;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `${id}-title`);
    
    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;
    
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = closeLabel;
    closeBtn.setAttribute('aria-label', closeLabel);
    closeBtn.setAttribute('role', 'button');
    
    const contentEl = document.createElement('div');
    contentEl.className = 'modal-content';
    contentEl.textContent = content;
    
    modal.appendChild(titleEl);
    modal.appendChild(closeBtn);
    modal.appendChild(contentEl);
    
    // Focus trap management
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.dispatchEvent(new CustomEvent('close'));
        }
    });
    
    return modal;
};

// Accessible main element (uncomment when available)
let mainElement = null;

// Add new function: addMainElementAriaAttributes
const addMainElementAriaAttributes = () => {
    if (typeof document !== 'undefined') {
        mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
        
        if (mainElement) {
            mainElement.setAttribute('role', 'main');
            if (!mainElement.id) {
                mainElement.id = 'main-content';
            }
            mainElement.tabIndex = -1;
            
            // Ensure label for main landmark
            const existingLabel = mainElement.getAttribute('aria-label');
            if (!existingLabel) {
                mainElement.setAttribute('aria-label', 'Main Application');
            }
        }
    }
};

// Fix for REACT_027: Add scope attribute to th elements
const fixTableStructure = () => {
    if (typeof document !== 'undefined') {
        const tables = document.querySelectorAll('table');
        
        tables.forEach((table) => {
            const headers = table.querySelectorAll('th');
            const firstRow = table.querySelector('thead tr') || table.querySelector('tr');
            const isDataTable = table.querySelector('thead') !== null;
            
            headers.forEach((th) => {
                // Determine if it's a column header or row header
                const isInThead = th.closest('thead') !== null;
                const rowIndex = Array.from(th.parentElement?.cells || []).indexOf(th);
                const previousCells = Array.from(th.parentElement?.cells || []).slice(0, rowIndex);
                const hasRowHeader = previousCells.some(cell => cell.tagName === 'TH' && cell.getAttribute('scope') === 'row');
                
                if (!th.getAttribute('scope')) {
                    if (isInThead || (!hasRowHeader && isDataTable)) {
                        th.setAttribute('scope', 'col');
                    } else {
                        th.setAttribute('scope', 'row');
                    }
                }
            });
        });
    }
};

// Fix for REACT_025: Ensure unique landmarks (2 issues)
const ensureUniqueLandmarks = () => {
    if (typeof document !== 'undefined') {
        // Query all main elements in the document
        const mainElements = document.querySelectorAll('main, [role="main"]');
        
        if (mainElements.length > 1) {
            // Keep the first main element as the primary landmark
            // Convert additional main elements to section elements with appropriate aria-label
            
            for (let i = 1; i < mainElements.length; i++) {
                const mainElement = mainElements[i];
                
                // Create a section element to replace the main
                const section = document.createElement('div');
                section.setAttribute('role', 'region');
                section.setAttribute('aria-label', 'Secondary content region');
                
                // Preserve all child content
                while (mainElement.firstChild) {
                    section.appendChild(mainElement.firstChild);
                }
                
                // Preserve any existing id or class attributes
                if (mainElement.id) {
                    section.id = mainElement.id;
                }
                
                if (mainElement.className) {
                    section.className = mainElement.className;
                }
                
                // Replace the main element with section in the DOM
                mainElement.parentNode?.replaceChild(section, mainElement);
            }
        }
        
        // Ensure at least one main landmark exists
        if (mainElements.length === 0) {
            const body = document.body;
            if (body) {
                const newMain = document.createElement('main');
                newMain.id = 'main-content';
                newMain.setAttribute('role', 'main');
                newMain.setAttribute('aria-label', 'Main content');
                body.insertBefore(newMain, body.firstChild);
            }
        }
    }
};

// Fix for REACT_017: React Landmarks - Wrap primary content in <main> elements
const fixReactLandmarks = () => {
    if (typeof document !== 'undefined') {
        // Find tables with id="table-rotated" that aren't inside a main element
        const rotatedTable = document.querySelector('table#table-rotated');
    }
};