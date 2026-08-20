function enhanceDependencyGraph() { const rotateBackLink = document.getElementById('unrotate'); if (rotateBackLink) { const button = document.createElement('button'); button.id = 'unrotate'; button.textContent = rotateBackLink.textContent; button.className = rotateBackLink.className; button.onclick = () => { if (rotateBackLink.onclick) { rotateBackLink.onclick(); } }; rotateBackLink.parentNode.replaceChild(button, rotateBackLink); } } document.addEventListener('DOMContentLoaded', enhanceDependencyGraph);
// This file should contain JavaScript code, not HTML
// The HTML content appears to be in a different file (dependency-graph.html)
// Please ensure all JavaScript code is properly formatted and valid
// Example of proper JavaScript code (if this was the actual content):
// import React from 'react';
// import App from './App';
// function Main() {
// return (
// <div className="App">
// <App />
// </div>
// );
// }
// export default Main;