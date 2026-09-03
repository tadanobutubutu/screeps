Here is the resolved file content:

```javascript
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

function wrapPrimaryContentInMain() {
  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');

    if (primaryContent.parentNode) {
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    } else {
      document.body.appendChild(mainElement);
    }

    mainElement.appendChild(primaryContent);

    return mainElement;
  }
  return null;
}

function enhanceAccessibilityForAddBook(form) {
  if (!form) return;

  if (!form.hasAttribute('role')) {
    form.setAttribute('role', 'form');
  }

  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    const id = input.id || input.getAttribute('name');
    if (!input.hasAttribute('aria-label') && !form.querySelector(`label[for="${id}"]`)) {
      const label = form.querySelector(`label[for="${id}"]`) || form.querySelector(`label[for="${input.name}"]`);
      if (!label) {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    }

    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton && !submitButton.hasAttribute('aria-label') && !submitButton.textContent.trim()) {
    submitButton.setAttribute('aria-label', 'Submit form');
  }

  return form;
}

import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook } from './bookFunctions';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import fs from 'fs';
import path from 'path';
import ReactA11y from '@react-aria/a11y';
import ReactHookForm, { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axe from 'axe-core';
import { IconContext } from 'react-icons';
import { BsBootstrap, MdAccessible, MdAddBox } from 'react-icons/all';

import AccessibilityUtils from './AccessibilityUtils';
import Utils from './Utils';
import baseFunctions from './baseFunctions';

function App() {
  // Combined import statement from the original and conflict files
  const [formState, setFormState] = useState({ book: {}, errors: {} });
  const { handleSubmit, register, errors } = useForm({
    resolver: yupResolver(bookSchema),
    mode: 'onBlur'
  });

  const onSubmit = (data) => {
    // Combined functionality for handling form submission
    addBook(data);
    setFormState((prevState) => ({ ...prevState, book: {} }));
  };

  useEffect(() => {
    // Combined functionality for focusing on the first input field after mounting
    const firstInput = document.querySelector('.form-control:first-child');
    if (firstInput && useFocusScope()) {
      useFocusScope.current.onEnter({ target: firstInput });
    }
  }, []);

  // Initialize schema for form validations
  const bookSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    author: yup.string().required('Author is required'),
    isbn: yup.string().required('ISBN is required').matches(/^\d{10,13}$/, 'Invalid ISBN format')
  });

  // Accessibility enhancements integrated from React accessibility improvements
  const { useFocusScope } = ReactA11y;

  // Accessing utility functions
  const { processData, upgradeSystem, validateInput, loadLandmarks, ensureUniqueLandmarks, fixFakeLinks, setLanguageAttribute } = Utils;

  // Integrating base functions for application logic
  const { getUserSafetyAdvice, computeSafetyScore, checkUserSafety, checkSafetyCategories, upgradeUserSettings } = baseFunctions;

  // Add accessibility enhancements from React accessibility improvements
  const { useFocusScope } = ReactA11y;

  // Added function to yield user safety advice
  function getAdvice() {
    return getUserSafetyAdvice();
  }

  // Added function to compute user safety score
  function score() {
    return computeSafetyScore(safetyCategories);
  }

  // Added function to check user safety
  function checkStatus() {
    return checkUserSafety();
  }

  // Added function to check safety categories
  function checkCategories() {
    return checkSafetyCategories();
  }

  // Added function to upgrade user settings
  function upgrade() {
    return upgradeUserSettings();
  }

  // Added function to process data (can be used if needed)
  function processData(data) {
    return processData(data);
  }

  // Added function to load landmarks (can be used if needed)
  function loadLandmarks() {
    return Utils.loadLandmarks();
  }

  // Added function to ensure unique landmarks (can be used if needed)
  function ensureUniqueLandmarks(landmarks) {
    return Utils.ensureUniqueLandmarks(landmarks);
  }

  // Added function to fix fake links (can be used if needed)
  function fixFakeLinks() {
    return fixFakeLinks();
  }

  // Added function to set language attribute (can be used if needed)
  function setLanguageAttribute(element) {
    if (element) {
      setLanguageAttribute(element);
    }
  }

  return (
    <div>
      <h1>Add a Book</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset>
          <div id="formFields">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                className="form-control"
                type="text"
                name="title"
                ref={register}
                error={errors.title}
                value={formState.book.title || ''}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    book: { ...formState.book, title: e.target.value }
                  })
                }
              />
              {errors.title && <div className="text-danger">{errors.title.message}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                className="form-control"
                type="text"
                name="author"
                ref={register}
                error={errors.author}
                value={formState.book.author || ''}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    book: { ...formState.book, author: e.target.value }
                  })
                }
              />
              {errors.author && <div className="text-danger">{errors.author.message}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="isbn">ISBN</label>
              <input
                className="form-control"
                type="text"
                name="isbn"
                ref={register}
                error={errors.isbn}
                value={formState.book.isbn || ''}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    book: { ...formState.book, isbn: e.target.value }
                  })
                }
              />
              {errors.isbn && <div className="text-danger">{errors.isbn.message}</div>}
            </div>
          </div>

          {/* Accessibility enhancements integrated from React accessibility improvements */}
          <IconContext.Provider value={{ className: 'accessible-icon' }}>
            <BsBootstrap /> {' '} <MdAccessible /> {' '} <MdAddBox />
          </IconContext.Provider>
        </fieldset>
        <button className="btn btn-primary mt-3" type="submit">
          Submit
        </button>
      </form>
      {/* Added sections to display safety advice, safety score, safety status, safety category status, and upgrade functions */}
      <div>
        <h2>Safety Advice:</h2>
        {getAdvice()}
      </div>
      <div>
        <h2>Safety Score:</h2>
        {score()}
      </div>
      <div>
        <h2>User Safety Status:</h2>
        {checkStatus()}
      </div>
      <div>
        <h2>Safety Category Status:</h2>
        {checkCategories()}
      </div>
      <div>
        <h2>Upgrade User Settings:</h2>
        {upgrade().length > 0 && (
          <ul>
            {upgrade().map(({ field, from, to }) => (
              <li key={field}>{field}: {from} -> {to}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
```