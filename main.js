// Import dependencyGraphContent and indexContent
import { dependencyGraphContent } from './dependencyGraphContent.js';
import { indexContent } from './indexContent.js';

// Assuming you have a button with ID 'myButton'
const button = document.getElementById('myButton');
button.innerHTML = 'My Button';
button.type = 'button';
button.disabled = false;

// New function to handle button click
function handleButtonClick() {
  button.disabled = true;
}

// Attach click event listener to the button
button.addEventListener('click', handleButtonClick);

// Function to render dependency graph
function renderDependencyGraph() {
  const graphElement = document.getElementById('dependency-graph');
  if (graphElement) {
    graphElement.innerHTML = dependencyGraphContent;
  }
}

// Function to render index view
function renderIndexView() {
  const indexElement = document.getElementById('index-view');
  if (indexElement) {
    indexElement.innerHTML = indexContent;
  }
}