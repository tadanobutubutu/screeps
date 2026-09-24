const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const { createServer, startApp, config } = require('./');
const { calculateSum } = require('./exports.js');

const port = PORT || 3000;

// Accessibility improvements
function addLangAttribute(element) {
    if (element && typeof element.setAttribute === 'function') {
        element.setAttribute('lang', 'en');
    }
    return element;
}

function addBook(form, onSuccess, onError) {
    if (!(form instanceof HTMLFormElement)) {
        const error = new Error('Invalid form element provided');
        if (typeof onError === 'function') onError(error);
        return;
    }

    // Set form attributes for accessibility
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add new book');

    const titleInput = form.querySelector('#title');
    const authorInput = form.querySelector('#author');

    // Ensure required fields have proper labeling
    if (titleInput) {
        titleInput.setAttribute('aria-required', 'true');
        titleInput.setAttribute('aria-label', 'Book title');
        if (!titleInput.id) titleInput.id = 'title';
    }
    if (authorInput) {
        authorInput.setAttribute('aria-required', 'true');
        authorInput.setAttribute('aria-label', 'Book author');
        if (!authorInput.id) authorInput.id = 'author';
    }

    // Add submit event listener
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = titleInput ? titleInput.value.trim() : '';
        const author = authorInput ? authorInput.value.trim() : '';

        if (!title || !author) {
            const error = new Error('Both title and author are required');
            if (typeof onError === 'function') onError(error);
            return;
        }

        // Simulate asynchronous addition
        const book = { title, author };
        if (typeof onSuccess === 'function') {
            onSuccess(book);
        }

        // Reset form
        form.reset();
        // Optionally clear aria-invalid states if any
        if (titleInput) titleInput.removeAttribute('aria-invalid');
        if (authorInput) authorInput.removeAttribute('aria-invalid');
    });

    // Enhance keyboard accessibility: allow adding a book with Ctrl+Enter
    form.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            const submitEvent = new Event('submit');
            form.dispatchEvent(submitEvent);
        }
    });
}

// Utility functions
function calculateSum(a, b) {
    return a + b;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        const btn = document.getElementById('addBookButton');
        if (btn && typeof makeAccessible === 'function') makeAccessible(btn);
        if (btn && typeof addAriaSupport === 'function') addAriaSupport(btn, 'Add a new book');
    });
}

// Address all accessibility issues
function addressInsightIssues() {
    addLangAttribute(typeof document !== 'undefined' ? (document.documentElement || document.body) : null);

    if (typeof landmarks !== 'undefined' && Array.isArray(landmarks)) {
        ensureLandmarkUniqueness(landmarks);
    }
    ensureUniqueLandmarks();

    validateTableAccessibility();
    validateTableStructure();

    getSvgAccessibleName();

    createInPageButton();
    createAccessibleLink();
    handleAccessibilityIssues();

    validateLandmark();
    validateLandmarkStructure();
}

function initializeApp() {
    addressInsightIssues();
    if (typeof wrapPrimaryContentInMain === 'function') {
        wrapPrimaryContentInMain();
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to the Screeps bot repository!');
});

app.post('/addBook', (req, res) => {
    if (req.body.title && req.body.author) {
        const book = { title: req.body.title, author: req.body.author };
        // Call the addBook function with the form submission data
        addBook(document.getElementById('addBookForm'), (bookToSave) => {
            const message = `Successfully saved book: ${bookToSave.title} - ${bookToSave.author}`;
            res.send(message);
        }, (error) => {
            res.status(500).send(error.message);
        });
    } else {
        res.status(400).send('Title and author are required fields');
    }
});

app.get('/dependencies', (req, res) => {
    const { dependencies, devDependencies, total } = countDependencies();
    res.send({ dependencies, devDependencies, total });
});

// Execute command and send response
app.post('/execCommand', (req, res) => {
    const command = req.body.command;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(`Command execution error: ${error.message}`);
        } else {
            const response = error ? stderr : stdout;
            res.send(response);
        }
    });
});

// Start the server
const server = createServer();
server.listen(config.port || port, () => {
    console.log(`Server running on port ${config.port || port}`);
    initializeApp();
});

function calculateDifference(a, b) {
    return a - b;
}

// Additional exports and functions
// ... (You might need to update this section depending on the changes in origin/main)

module.exports = {
    calculateSum,
    calculateDifference,
    // Add other exported functions here
};