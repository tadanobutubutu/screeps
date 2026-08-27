import { class1, function1, Object1 } from './path/to/module';

// Function to add lang attribute to HTML element
function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.querySelector('[lang]');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }
    
    if (!existingTbody) {
      const remainingRows = Array.from(rows).slice(existingThead ? 0 : 1);
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }
    
    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      // Check if first cell should be a header
      if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
        const firstCell = cells[0];
        const th = document.createElement('th');
        th.textContent = firstCell.textContent;
        th.scope = 'col';
        row.insertBefore(th, firstCell);
        fixedCount++;
      }
    });
    
    // Additional HEAD logic: ensure scope on header cells
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
        fixedCount++;
      }
    });
  });

  return fixedCount;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    // Find the main content area and wrap it or create main element
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    
    // Move first significant content child to main
    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }
    
    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }
  
  // Ensure main has proper role if not using native element
  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }
  
  return mainElement;
}

// Function to add/main landmark
function fixFakeLinkIssue(document) {
  fixFakeLinkIssues(document);
  let count = 0;

  const clickableElements = document.querySelectorAll('[onclick]');

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';
    
    // Check if it's a fake link (clickable but not a real anchor)