const express = require('express');
const app = express();

// ... existing code ...

// Render UI with rotate back button
function renderUI() {
    const html = `
        <div class="controls">
            <button id="unrotate">rotate back</button>
        </div>
    `;
    return html;
}

// ... rest of the code ...