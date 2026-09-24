// Original content from main.js (excluding conflict markers)

// Existing code from main.js that needs to be preserved

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, onClickCallback) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.addEventListener('click', onClickCallback);
    document.body.appendChild(button);
}

// Existing code from main.js that needs to be preserved

// Existing exports from main.js that need to be preserved
export function someExistingFunction() {
    // Function implementation
}

// Existing code from main.js that needs to be preserved

// New exports if any (based on the requirement to preserve existing exports)
export { createInPageButton, someExistingFunction };

// Existing code from main.js that needs to be preserved