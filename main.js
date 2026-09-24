import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

import { HTML, HeadFunctionProps, HTMLElement } from 'react';
import axios from 'axios';
import { getConfig } from './config';

// Creating in-page buttons function
const createInPageButtons = (buttonsData) => {
  const buttonsContainer = document.getElementById('in-page-buttons-container');

  if (!buttonsContainer) {
    console.error('In-page buttons container not found');
    return;
  }

  buttonsData.forEach(buttonData => {
    const button = document.createElement('button');
    button.id = buttonData.id;
    button.textContent = buttonData.text;
    button.setAttribute('data-role', buttonData.role);

    button.addEventListener('click', () => {
      location.hash = buttonData.href;
    });

    buttonsContainer.appendChild(button);
  });
};

// Adding book with accessibility features function
const addBookAccessibility = (bookData) => {
  const bookForm = document.getElementById('add-book-form');
  if (!bookForm) {
    console.error('Book form not found');
    return;
  }

  // Adding React components for better accessibility
  const titleInput = (
    <input
      type="text"
      id="book-title"
      aria-label="Book title"
      aria-required="true"
    />
  ) as HTMLElement;

  const authorInput = (
    <input
      type="text"
      id="book-author"
      aria-label="Book author"
      aria-required="true"
    />
  ) as HTMLElement;

  const submitButton = (
    <button type="submit" aria-label="Submit new book">
      Add Book
    </button>
  ) as HTMLElement;

  // Adding React labels for better accessibility
  const titleLabel = <label htmlFor="book-title">Title:</label>;
  const authorLabel = <label htmlFor="book-author">Author:</label>;

  // Adding the nested HTML components to the React components
  // Then add the complete component tree to the form
  bookForm.appendChild(titleLabel.cloneNode(true));
  bookForm.appendChild(titleInput);
  bookForm.appendChild(authorLabel.cloneNode(true));
  bookForm.appendChild(authorInput);
  bookForm.appendChild(submitButton);

  // Adding a fetch API callback for submitting the form (React)
  bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post(getConfig().apiUrl + '/books', { title, author });
      console.log('Book added:', response.data);

      // Clear form after submission (React)
      titleInput.value = '';
      authorInput.value = '';
    } catch (error) {
      console.error('Error adding book:', error);
    }
  });

  // Exporting the new functions
  export { createInPageButtons, addBookAccessibility };
};

// ... (previous and updated code remains as it is)