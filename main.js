import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { generateDependencyReport, utils, axe } from './utils';
import { validateLandmark, validateLandmarkData, addLandmarkRoles } from './utils/accessibility';

let icons = {};
let dependencyGraph = {};

const books = [];
const booksForm = document.querySelector('.books-form');

export const validateLandmarkInput = (landmark) => {
  const errors = [];

  if (!validateLandmark(landmark)) {
    errors.push('Landmark is missing or invalid');
  }

  if (booksForm && booksForm.querySelector(`[data-id="${landmark.id}"]`)) {
    errors.push('A book already exists with this landmark ID');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const landmarkStructureCheck = (landmark) => {
  const issues = [];

  if (!landmark) {
    issues.push('Missing landmark element');
  }
  if (!landmark.getAttribute('role')) {
    issues.push('Landmark is missing ARIA role attribute');
  }

  return issues;
};

export const addBook = (book) => {
  if (validateLandmarkInput(book).valid) {
    books.push(book);
    renderBooks(books);
  }
};

export const addBookAccessibility = () => {
  const bookForm = document.querySelector('.books-form');

  if (!bookForm) {
    console.error('Book form not found');
    return;
  }

  // Create form elements with proper ARIA attributes
  const titleInput = bookForm.querySelector('#titleInput');
  titleInput.setAttribute('aria-label', 'Book title');
  const authorInput = bookForm.querySelector('#authorInput');
  authorInput.setAttribute('aria-label', 'Book author');

  // Add labels for better accessibility
  const titleLabel = document.createElement('label');
  titleLabel.htmlFor = 'titleInput';
  titleLabel.textContent = 'Title:';
  bookForm.prepend(titleLabel);

  const authorLabel = document.createElement('label');
  authorLabel.htmlFor = 'authorInput';
  authorLabel.textContent = 'Author:';
  bookForm.appendChild(authorLabel);
};

export const addMainLandmark = () => {
  const main = document.createElement('main');
  main.id = 'main';
  main.role = 'main';

  document.body.appendChild(main);
};

export const addProperLandmarkRegions = () => {
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];

  landmarks.forEach((type) => {
    const el = document.querySelector(`[role="${type}"]`);

    if (!el || !el.id) {
      console.error(`Missing or lacking ID attribute on ${type} landmark`);
      return;
    }

    el.setAttribute('aria-labelledby', el.id);
  });
};

export const handleCredentialResponse = (credentialResponse) => {
  // ...
};

export const handleFakeLinks = () => {
  // ...
};

export const renderBooks = (books) => {
  // ...
};

export default initializeApp;