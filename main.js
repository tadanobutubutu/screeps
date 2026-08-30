// TODO: This is the existing code that needs to be preserved

// Import the new function to create a button with correct accessibility properties for in-page linking
import createAccessibleButton from './utils/createAccessibleButton';

// Example usage of the new function
const myButton = createAccessibleButton('Go to Section 2', 'section2-link');
document.body.appendChild(myButton);