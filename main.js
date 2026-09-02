// ... (The rest of the code remains the same as in the provided content)

// Add the function for creating in-page buttons
function createInPageButtons(buttonData) {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('in-page-buttons');

    buttonData.forEach(({ id, label, href }) => {
        const button = document.createElement('a');
        button.href = href;
        button.textContent = label;
        button.dataset.id = id;
        buttonsContainer.appendChild(button);
    });

    document.body.appendChild(buttonsContainer);
}

// Export the new function
module.exports = {
    // ... (The existing exports remain the same)
    createInPageButtons,
};