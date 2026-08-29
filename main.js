import { dependencyGraphContent, indexContent } from './content';

// Add lang attribute to HTML element
document.documentElement.lang = 'en';

// Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Example of adding an ARIA role if needed (as per the insight report)
// Assuming there is a container element with an ID of 'main-container'
const mainContainer = document.getElementById('main-container');
if (mainContainer) {
  mainContainer.setAttribute('role', 'main');
}