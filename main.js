// Import and ReactDOM rendering remain unchanged
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Set the language attribute on the HTML element for accessibility
document.documentElement.lang = 'en';

// Function to check if all <th> elements have the scope attribute
function checkThScopeAttribute(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const thElements = fileContent.match(/<th\b[^>]*>/g);
  if (!thElements) {
    return true; // No <th> elements found, so no issue
  }

  const hasNoScope = thElements.some((th) => {
    return !th.includes('scope="');
  });

  return !hasNoScope;
}

// Function to test the presence of the scope attribute in all <th> elements
function testThScopeAttribute() {
  const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
  const hasScopeAttribute = checkThScopeAttribute(filePath);

  if (!hasScopeAttribute) {
    throw new Error('Not all <th> elements have the scope attribute.');
  }

  console.log('All <th> elements have the scope attribute.');
}

// Run the test
testThScopeAttribute();

const root = ReactDOM.createRoot(document.getElementById('root'));
const main = document.createElement('main');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

main.appendChild(root.renderToString(<App />));
document.body.insertBefore(main, document.getElementById('root'));

// Address landmark issues
const landmarks = document.querySelectorAll('.landmark');
landmarks.forEach((landmark, index) => {
  landmark.setAttribute('role', 'landmark');
  landmark.setAttribute('aria-labelledby', `landmark-label-${index}`);
});

// Add accessible names to SVGs
const svg1 = document.querySelector('#svg1');
const svg2 = document.querySelector('#svg2');
svg1.setAttribute('aria-labelledby', 'svg1-title');
svg2.setAttribute('aria-labelledby', 'svg2-title');

// Ensure unique landmarks
const landmark1 = document.getElementById('unique-landmark-1');
const landmark2 = document.getElementById('unique-landmark-2');
if (!landmark1) {
  landmark1 = document.getElementById('landmark1');
  landmark1.setAttribute('id', 'unique-landmark-1');
}
if (!landmark2) {
  landmark2 = document.getElementById('landmark2');
  landmark2.setAttribute('id', 'unique-landmark-2');
}

// Fix fake link issue
const fakeLinks = document.querySelectorAll('.fake-link');
fakeLinks.forEach(link => {
  link.setAttribute('role', 'presentation');
});