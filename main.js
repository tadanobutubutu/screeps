// main.js

// Find the primary content element in the DOM
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
    // Create a new <main> element
    const mainElement = document.createElement('main');

    // Insert the <main> element before the primary content in the DOM
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);

    // Move the primary content inside the <main> element
    mainElement.appendChild(primaryContent);

    return mainElement;
  }
  return null;
}

function enhanceAccessibilityForAddBook(form) {
  if (!form) return;

  // Ensure form has proper accessibility attributes
  if (!form.hasAttribute('role')) {
    form.setAttribute('role', 'form');
  }

  // Get all input fields in the form
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    // Ensure each input has an aria-label or associated label
    const id = input.id || input.getAttribute('name');
    if (!input.hasAttribute('aria-label') && !form.querySelector(`label[for="${id}"]`)) {
      const label = form.querySelector(`label[for="${id}"]`) || form.querySelector(`label[for="${input.name}"]`);
      if (!label) {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    }

    // Ensure required fields have proper ARIA attributes
    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });

  // Get the submit button
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton && !submitButton.hasAttribute('aria-label') && !submitButton.textContent.trim()) {
    submitButton.setAttribute('aria-label', 'Submit form');
  }

  return form;
}

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook } from './bookFunctions';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import fs from 'fs';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import App from './App';
import { helper, formatDate } from './utils';
import { someFunction } from './utils/someFunction';
import express from 'express';
import path from 'path';
import { fetchUser, clearCache } from './utils/user';

// Landmark data structure (merged changes)
const landmarks = [];

// Accessibility improvements: landmark attribute handling (added from the merged changes)
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function getSvgAccessibleName(element) {
  return element.getAttribute('aria-label') ||
         element.getAttribute('title') ||
         (element.querySelector('title')?.textContent || '');
}

function setSvgAttributes(element, accessibleName) {
  if (!accessibleName) {
    accessibleName = getSvgAccessibleName(element);
  }

  if (accessibleName) {
    element.setAttribute('aria-label', accessibleName);
  }
}

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Tutorial: Here's how you can merge changes from both sides
// Integrate the necessary functions from each side that offer new features or improvements
// (without discarding functionality or introducing syntax errors)
// Check for available landmarks
function checkLandmarks() {
  const landmarksImported = loadLandmarks();
  if (landmarksImported.length > 0) {
    return landmarksImported;
  }

  const landmarksDom = [];
  const landmarksContainers = document.querySelectorAll('.landmark-container');

  for (const container of landmarksContainers) {
    // TODO: Integrate the logic for validating landmark elements and adding roles when necessary
    const checkForLandmarksInContainer = (element) => {
      if (element.hasAttribute('role') && CONFIG.landmarkRoles.includes(element.getAttribute('role'))) {
        landmarksDom.push(element);
      }
      return element.children.length > 0 ? Array.from(element.children) : [];
    };

    // Iterate through the children of the container and check for landmark elements
    const children = [...container.children];
    let currentElements = checkForLandmarksInContainer(children.pop());

    // Process the children recursively to find all the landmark elements
    while (currentElements.length > 0) {
      let newChildren = [];
      for (const element of currentElements) {
        newChildren = newChildren.concat(checkForLandmarksInContainer(element));
      }
      currentElements = newChildren;
    }

    landmarksDom.push(...currentElements);
  }

  return landmarksDom;
}

function validateLandmarkStructure(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Check for required properties
  if (!landmark.role) {
    errors.push('Landmark must have a role');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Ensure unique landmarks by filtering duplicates (merged changes)
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
    return {};
  }

  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.getAttribute('id') || landmark.getAttribute('aria-labelledby') || JSON.stringify(landmark);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Ensures that focusable elements have proper roles (added from merged changes)
function ensureFocusableElements(container, allowedRoles = CONFIG.landmarkRoles) {
  if (!container) return;

  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
  const focusableElements = container.querySelectorAll(focusableSelectors);

  focusableElements.forEach((el, index) => {
    const role = el.getAttribute('role');
    if (role && !allowedRoles.includes(role)) {
      console.warn(`Focusable element at index ${index} has unexpected role: ${role}`);
    }
  });

  return focusableElements;
}

// New functions and improvements to be implemented
// Integrate the new function as requested
function newFunction() {
  // Implementation of the new function
  console.log('New function executed');
}

// TODO: Update the existing function as required
function handleCredentialResponse(response) {
  // Parse the credential response
  const credential = JSON.parse(response.credential);

  // Validate the credential structure
  if (!credential || !credential.credential || !credential.clientId) {
    throw new Error('Invalid credential response structure');
  }

  // Store the credential in a secure way (implementation depends on your auth system)
  // For example, you might store it in a secure cookie or local storage with encryption
  // This is a placeholder for your actual implementation
  localStorage.setItem('authCredential', JSON.stringify({
    token: credential.credential,
    clientId: credential.clientId,
    timestamp: Date.now()
  }));

  // Return the parsed credential for further use
  return credential;
}

// Other merged changes can be integrated here as needed

// ... (Rest of the existing code remains the same)