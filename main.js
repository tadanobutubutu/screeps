const { getHTML } = require('./utils'); // Add this line to import getHTML
 const { processDOM } = require('./dom-manipulation'); // Add this line to import processDOM

 // New function to ensure HTML lang attribute is set
 function addLangAttribute() {
   // Assuming getHTML is used to get the HTML element
   processDOM(getHTML('setLangAttribute'), { lang: 'en' });
 }

 // New function to handle button click
 function handleButtonClick(buttonId) {
   const button = document.getElementById(buttonId);
   if (button) {
     const isExpanded = button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
     button.setAttribute('aria-expanded', isExpanded);
   }
 }

 // New function to inject and fix fake links
 function fixFakeLinks() {
   const fakeLinks = document.querySelectorAll('[data-fake-link], .fake-link');
   fakeLinks.forEach(fakeLink => {
     if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
       const a = document.createElement('a');
       a.href = fakeLink.dataset.href || fakeLink.getAttribute('href') || '#';
       a.textContent = fakeLink.textContent;
       a.setAttribute('role', 'button');
       // Copy relevant attributes
       Array.from(fakeLink.attributes).forEach(attr => {
         if (attr.name !== 'href' && attr.name !== 'class') {
           a.setAttribute(attr.name, attr.value);
         }
       });
       fakeLink.parentNode.replaceChild(a, fakeLink);
     }
   });
 }

 // Ensure Unique Landmarks Function
 function ensureUniqueLandmarks() {
   const existingHeaders = Array.from(document.querySelectorAll('header[role="banner"]'));
   const existingFooters = Array.from(document.querySelectorAll('footer[role="contentinfo"]'));

   if (existingHeaders.length > 1) {
     existingHeaders.forEach((header, index) => {
       if (index > 0) {
         header.remove();
       }
     });
   }
   if (existingFooters.length > 1) {
     existingFooters.forEach((footer, index) => {
       if (index > 0) {
         footer.remove();
       }
     });
   }
 }

 // New function to inject primary content into main landmark
 function wrapPrimaryContentInMain() {
   let mainElement;
   const existingMains = Array.from(document.querySelectorAll('main, [role="main"]'));

   // Remove duplicate main elements if any
   existingMains.forEach((main, index) => {
     if (index > 0) {
       main.remove();
     }
   });

   // Search for primary content container (adjust selector based on your content structure)
   const contentContainer = document.querySelector('#content') || document.querySelector('.content') || document.body;

   // If no main element exists, create and wrap primary content
   if (!existingMains.length) {
     mainElement = document.createElement('main');
     mainElement.setAttribute('role', 'main');
   } else {
     mainElement = existingMains[0];
   }

   // Move existing content into main if not already inside one
   if (!contentContainer.closest('main, [role="main"]')) {
     while (contentContainer.firstChild) {
       mainElement.appendChild(contentContainer.firstChild);
     }
     contentContainer.appendChild(mainElement);
   }
 }

 // Add function to add 'scope="col"' attribute to table header cells
 function addScopeToTableHeaders() {
   const headers = document.querySelectorAll('th');
   headers.forEach(header => {
     if (!header.hasAttribute('scope')) {
       header.setAttribute('scope', 'col');
     }
   });
 }

 // New function to add accessible names to SVGs
 function addAccessibleSVGs() {
   const svgs = document.querySelectorAll('svg');
   svgs.forEach((svg, index) => {
     const existingTitle = svg.querySelector('title');
     if (!existingTitle) {
       const title = document.createElement('title');
       title.textContent = svg.getAttribute('aria-label') || `SVG graphic ${index + 1}`;
       title.id = `svg-title-${index}`;
       svg.insertBefore(title, svg.firstChild);
     }
     // Ensure aria-labelledby points to the title
     const ariaLabel = svg.getAttribute('aria-labelledby');
     const titleId = existingTitle ? existingTitle.id : `svg-title-${index}`;
     if (!ariaLabel && !svg.getAttribute('aria-label')) {
       svg.setAttribute('aria-labelledby', titleId);
     }
   });
 }

 // New function to process accessibility issues from insight report
 function processAccessibilityIssues(insightReport) {
   // Process each issue from the insight report and address accordingly
   if (insightReport && insightReport.issues) {
     insightReport.issues.forEach(issue => {
       switch (issue.code) {
         case 'REACT_015':
           // Add lang attribute to HTML element
           addLangAttribute();
           break;
         case 'FAKE_LINKS':
           // Fix fake links
           fixFakeLinks();
           break;
         case 'UNIQUE_LANDMARKS':
           // Ensure unique landmarks
           ensureUniqueLandmarks();
           break;
         case 'LANDMARK_STRUCTURE':
           // Ensure proper landmark structure
           wrapPrimaryContentInMain();
           break;
         case 'ACCESSIBLE_SVGS':
           // Add accessible SVGs
           addAccessibleSVGs();
           break;
         case 'TABLE_HEADERS':
           // Add scope to table headers
           addScopeToTableHeaders();
           break;
         default:
           // Unknown issue type, ignore
           break;
       }
     });
   }

   // Run all accessibility fixes regardless of report content as fallback
   addLangAttribute();
   fixFakeLinks();
   ensureUniqueLandmarks();
   wrapPrimaryContentInMain();
   addAccessibleSVGs();
   addScopeToTableHeaders();
 }

 // Assuming you have a button with ID 'myButton'
 const myButton = document.getElementById('myButton');
 if (myButton) {
   myButton.setAttribute('aria-label', 'My Button');
   myButton.setAttribute('role', 'button');
 }

 // Call all necessary functions on DOM ready
 if (typeof document !== 'undefined') {
   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', () => {
       processAccessibilityIssues();
     });
   } else {
     processAccessibilityIssues();
   }
 }

 module.exports = {
   wrapPrimaryContentInMain,
   handleButtonClick,
   addLangAttribute,
   fixFakeLinks,
   ensureUniqueLandmarks,
   addScopeToTableHeaders,
   addAccessibleSVGs,
   processAccessibilityIssues,
 };

 // Add this line to export getHTML and processDOM functions
 module.exports = {
   ...module.exports,
   getHTML,
   processDOM,
 };