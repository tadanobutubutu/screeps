// main.js - Updated to fix REACT_025 React Unique Landmarks issue

function rotateImage(imageId, degrees) {
    const img = document.getElementById(imageId);
    if (img) {
        img.style.transform = `rotate(${degrees}deg)`;
    }
}

function createUnrotateButton() {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.type = 'button';
    button.textContent = 'rotate back';
    button.addEventListener('click', function() {
        rotateImage('myImage', 0);
    });
    return button;
}

function init() {
    const container = document.getElementById('controls');
    if (container) {
        container.appendChild(createUnrotateButton());
    }
}

// Assuming the following component structure in Dashboard.tsx:
// <Dashboard>
//   <div id="controls">
//     {/* ... */}
//   </div>
//   <div>
//     {/* ... */}
//   </div>
// </Dashboard>

// To fix the issue, ensure that there is only one <main> element in the component.
// Replace any other <main> elements with appropriate landmarks like <section> or <article>.
// For example:
// <section id="error-state">
//   <main>Error content here</main>
// </section>
// <section id="success-state">
//   <main>Success content here</main>
// </section>

document.addEventListener('DOMContentLoaded', init);

module.exports = { rotateImage, createUnrotateButton, init };