import { dependencyGraphContent, indexContent } from './content';

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main') || document.body;
  
  const accessibleContent = document.createElement('div');
  accessibleContent.setAttribute('role', 'main');
  accessibleContent.setAttribute('aria-label', 'Main content');
  accessibleContent.setAttribute('tabindex', '-1');
  
  const indexSection = document.createElement('section');
  indexSection.setAttribute('aria-label', 'Index');
  indexSection.innerHTML = indexContent;
  
  const graphSection = document.createElement('section');
  graphSection.setAttribute('aria-label', 'Dependency Graph');
  graphSection.setAttribute('role', 'region');
  graphSection.innerHTML = dependencyGraphContent;
  
  accessibleContent.appendChild(indexSection);
  accessibleContent.appendChild(graphSection);
  
  main.appendChild(accessibleContent);
});