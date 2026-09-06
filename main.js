// main.js
// Updated to import and use dependencyGraphContent and indexContent

import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Existing functions (preserved)
 function addAriaHiddenToDecorativeSVGs() {
   const decorativeSVGs = document.querySelectorAll('svg');
   decorativeSVGs.forEach((svg) => {
     if (!svg.getAttribute('aria-hidden') && !svg.hasAttribute('role')) {
       svg.setAttribute('aria-hidden', 'true');
     }
   });
 }

 function validateLandmark() {
   const results = {
     valid: [],
     invalid: []
   };

   const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');

   landmarks.forEach((landmark) => {
     const role = landmark.getAttribute('role');
     const ariaLabel = landmark.getAttribute('aria-label');
     const ariaLabelledby = landmark.getAttribute('aria-labelledby');

     // Check if landmark has proper labeling
     const hasProperLabeling = ariaLabel || ariaLabelledby;

     if (hasProperLabeling) {
       results.valid.push(landmark);
     } else {
       results.invalid.push({
         element: landmark,
         message: 'Landmark element is missing accessible label (aria-label or aria-labelledby)'
       });
     }
   });

   return results;
 }

 function addAriaLabelToFormInputs() {
   const formInputs = document.querySelectorAll('input');
   formInputs.forEach((input) => {
     if (!input.id && input.type !== 'hidden') {
       input.id = `input-${Date.now()}`;
       input.setAttribute('aria-label', `Enter ${input.name || 'value'}`);
     }
   });
 }

 function addAriaLabelledbyToHeadings() {
   const headings = document.querySelectorAll('h2, h3');

   headings.forEach((heading) => {
     if (!heading.hasAttribute('id')) {
       const labelId = `heading-${heading.dataset.index}`;
       heading.dataset.index = String(Date.now());
       heading.setAttribute('id', labelId);
       heading.setAttribute('aria-labelledby', labelId);
       heading.textContent = heading.textContent;
     }
   });
 }

 /**
  * Renders the dependency graph view.
  * Updated to use dependencyGraphContent.
  */
 export function renderDependencyGraph() {
   // Example usage: replace with actual rendering logic
   console.log('Rendering dependency graph', dependencyGraphContent);
 }

 /**
  * Renders the index view.
  * Updated to use indexContent.
  */
 export function renderIndex() {
   // Example usage: replace with actual rendering logic
   console.log('Rendering index', indexContent);
 }

 // Any other existing code remains unchanged